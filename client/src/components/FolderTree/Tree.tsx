import React, { useState } from 'react';

import { StrollableContainer } from 'react-stroller';
import { ContextMenuTrigger } from 'react-contextmenu';

import styled from 'styled-components';
import Folder from './Folder';
import File from './File';
import * as Y from 'yjs';

import ProjectTreeCardRightClickMenu from '../RightClickMenu/ProjectTreeRightClickMenu';

const StyledTree = styled.div`
	line-height: 1.5;
`;

const LightScrollbar = styled.div`
	width: 10px;
	background-color: #fff;
	opacity: 0.7;
	border-radius: 4px;
	margin: 4px;
`;

interface ITreeProps {
	project: Y.Map<unknown>;
}

interface IProjectStructure {
	tree: JSX.Element[];
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	};
	currId: [number];
}

function createTree(
	project: Y.Map<unknown>,
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	},
	currId: [number]
) {
	const nodes: JSX.Element[] = [];

	const addFile = (folderId) => {
		currId[0] += 1;
		const fileName = `file ${currId[0]}`;
		const currentFolder = idToNodeMap[folderId];
		const newFile = new Y.Map();
		currentFolder.set(fileName, newFile);
		newFile.set('content', new Y.Text());
		newFile.set('name', `${fileName}.gg`);
	};

	const itemKeys = Array.from(project.keys());
	itemKeys.forEach((key) => {
		if (!(project.get(key) instanceof Y.Map)) {
			return;
		}
		const curr = project.get(key) as Y.Map<unknown>;
		if (!curr.get('isFolder')) {
			// FILE
			currId[0] += 1;
			const fileKey = `treeItem:${currId[0]}`;
			const file = (
				<div key={fileKey}>
					<ContextMenuTrigger id={fileKey} holdToDisplay={-1}>
						<File name={curr.get('name') as string} />
					</ContextMenuTrigger>
					<ProjectTreeCardRightClickMenu
						id={fileKey}
						nodeId={currId[0]}
						isFolder={false}
						handleAddFile={addFile}
					/>
				</div>
			);
			idToNodeMap[currId[0]] = curr;
			nodes.push(file);
		} else {
			// FOLDER
			const folderId = currId[0] + 1;
			const folderKey = `treeItem:${folderId}`;
			currId[0] += 1;
			const children = createTree(curr, idToNodeMap, currId).tree;
			const folder = (
				<div key={folderKey}>
					<ContextMenuTrigger id={folderKey} holdToDisplay={-1}>
						<Folder name={curr.get('name') as string}>{children}</Folder>
					</ContextMenuTrigger>
					<ProjectTreeCardRightClickMenu
						id={folderKey}
						nodeId={folderId}
						isFolder
						handleAddFile={addFile}
					/>
				</div>
			);
			idToNodeMap[folderId] = curr;
			nodes.push(folder);
		}
	});

	const result: IProjectStructure = { tree: nodes, idToNodeMap, currId };
	return result;
}

export default function FolderTree(props: ITreeProps): JSX.Element {
	const { project } = props;

	const idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	} = {};

	idToNodeMap[0] = project;

	const [projectStructure, setProjectStructure] = useState<IProjectStructure>(
		createTree(project, idToNodeMap, [0])
	);

	return (
		<nav className="prj-tree-nav">
			<div className="tree">
				{/* <ContextMenuTrigger id="folder-tree-root" holdToDisplay={-1}>

				</ContextMenuTrigger>
				<ProjectTreeCardRightClickMenu
					id="folder-tree-root"
					isFolder
					handleAddFile={addFile}
				/> */}

				<StrollableContainer draggable bar={LightScrollbar}>
					<StyledTree>{projectStructure.tree}</StyledTree>
				</StrollableContainer>
			</div>
		</nav>
	);
}

FolderTree.File = File;
FolderTree.Folder = Folder;
