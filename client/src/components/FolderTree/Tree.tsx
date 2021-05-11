import * as Y from 'yjs';

import { ContextMenuTrigger } from 'react-contextmenu';
import File from './File';
import Folder from './Folder';
import ProjectTreeCardRightClickMenu from '../RightClickMenu/ProjectTreeRightClickMenu';
import React from 'react';
import { StrollableContainer } from 'react-stroller';
import styled from 'styled-components';

/* eslint-disable react/button-has-type */

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
	onFileClick: (file: Y.Map<unknown>) => void;
}

function createTree(
	project: Y.Map<unknown>,
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	},
	currId: [number],
	onFileClick: (file: Y.Map<unknown>) => void
): JSX.Element[] {
	const nodes: JSX.Element[] = [];

	const addFile = (folderId) => {
		currId[0] += 1;
		const fileName = `file ${currId[0]}`;
		const currentFolder = idToNodeMap[folderId];
		const newFile = new Y.Map();
		currentFolder.set(fileName, newFile);
		newFile.set('content', new Y.Text());
		newFile.set('name', fileName);
		newFile.set('isFolder', false);

		const currentFolderPath = currentFolder.get('path') as string;
		newFile.set('path', currentFolderPath + fileName);
	};

	const addFolder = (folderId) => {
		currId[0] += 1;
		const folderName = `folder ${currId[0]}`;
		const currentFolder = idToNodeMap[folderId];
		const newFolder = new Y.Map();
		currentFolder.set(folderName, newFolder);
		newFolder.set('name', folderName);
		newFolder.set('isFolder', true);

		const currentFolderPath = currentFolder.get('path') as string;
		newFolder.set('path', `${currentFolderPath + folderName}/`);
	};

	const removeItem = (nodeId) => {
		const item = idToNodeMap[nodeId];
		const parent = item.parent as Y.Map<unknown>;
		const itemName = item.get('name') as string;
		if (parent.has(itemName)) {
			parent.delete(itemName);
		}
	};

	const renameItem = (nodeId) => {
		const item = idToNodeMap[nodeId];
		const parent = item.parent as Y.Map<unknown>;
		const itemName = item.get('name') as string;
		if (parent.has(itemName)) {
			parent.delete(itemName);
		}
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
						<File
							name={curr.get('name') as string}
							onFileClick={() => {
								onFileClick(curr);
							}}
						/>
					</ContextMenuTrigger>
					<ProjectTreeCardRightClickMenu
						id={fileKey}
						nodeId={currId[0]}
						isFolder={false}
						handleRemoveItem={removeItem}
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
			const children = createTree(curr, idToNodeMap, currId, onFileClick);
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
						handleAddFolder={addFolder}
						handleRemoveItem={removeItem}
					/>
				</div>
			);
			idToNodeMap[folderId] = curr;
			nodes.push(folder);
		}
	});

	return nodes;
}

export default function FolderTree(props: ITreeProps): JSX.Element {
	const { project, onFileClick } = props;

	const idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	} = {};

	idToNodeMap[0] = project;

	const tree = createTree(project, idToNodeMap, [0], onFileClick);

	console.log(idToNodeMap);

	return (
		<nav className="prj-tree-nav">
			<ContextMenuTrigger id="folder-tree-root" holdToDisplay={-1}>
				<div className="tree">
					<StrollableContainer draggable bar={LightScrollbar}>
						<StyledTree>{tree}</StyledTree>
					</StrollableContainer>
				</div>
			</ContextMenuTrigger>
		</nav>
	);
}

FolderTree.File = File;
FolderTree.Folder = Folder;
