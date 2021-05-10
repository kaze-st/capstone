/* eslint-disable react/button-has-type */
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

function createTree(
	project: Y.Map<unknown>,
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	},
	currId: [number]
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
	};

	const addFolder = (folderId) => {
		currId[0] += 1;
		const folderName = `folder ${currId[0]}`;
		const currentFolder = idToNodeMap[folderId];
		const newFolder = new Y.Map();
		currentFolder.set(folderName, newFolder);
		newFolder.set('name', folderName);
		newFolder.set('isFolder', true);
		console.log(currentFolder);
	};

	const removeItem = (nodeId) => {
		const item = idToNodeMap[nodeId];
		// if (item.get('isFolder') !== true) {
		// 	// console.log(file)

		// 	}
		// } else {
		// 	// console.log(folder)
		// }
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
						<File name={curr.get('name') as string} />
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
			const children = createTree(curr, idToNodeMap, currId);
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
	const { project } = props;

	const idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	} = {};

	idToNodeMap[0] = project;

	const tree = createTree(project, idToNodeMap, [0]);

	const addFileRoot = () => {
		const fileName = `file ${Math.random()}`;
		const currentFolder = idToNodeMap[0];
		const newFile = new Y.Map();
		currentFolder.set(fileName, newFile);
		newFile.set('content', new Y.Text());
		newFile.set('name', fileName);
	};

	return (
		<nav className="prj-tree-nav">
			<ContextMenuTrigger id="folder-tree-root" holdToDisplay={-1}>
				<div className="tree">
					<StrollableContainer draggable bar={LightScrollbar}>
						<StyledTree>{tree}</StyledTree>
					</StrollableContainer>
				</div>
			</ContextMenuTrigger>

			<ProjectTreeCardRightClickMenu
				id="folder-tree-root"
				nodeId={0}
				isFolder
				handleAddFile={addFileRoot}
			/>
			<button onClick={addFileRoot}>ADD FILE TO ROOT</button>
		</nav>
	);
}

FolderTree.File = File;
FolderTree.Folder = Folder;
