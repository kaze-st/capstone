import './FolderTree.scss';

import * as Y from 'yjs';

import FolderTreeProvider, { useFolderTree } from './FolderTreeContext';
import React, { useState } from 'react';

import { ContextMenuTrigger } from 'react-contextmenu';
import File from './File';
import Folder from './Folder';
import ProjectTreeCardRightClickMenu from '../RightClickMenu/ProjectTreeRightClickMenu';
import { StrollableContainer } from 'react-stroller';
import TempInput from './TempInput';
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
	isPlayground: boolean;
}

function removeItemFromTree(
	nodeId: string,
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	}
) {
	const item = idToNodeMap[nodeId];
	const parent = item.parent as Y.Map<unknown>;
	const itemName = item.get('name') as string;
	if (parent.has(itemName)) {
		parent.delete(itemName);
	}
}

function createTree(
	project: Y.Map<unknown>,
	idToNodeMap: {
		[id: number]: Y.Map<unknown>;
	},
	currId: [number],
	onFileClick: (file: Y.Map<unknown>) => void,
	setIsBlur: React.Dispatch<React.SetStateAction<boolean>>,
	isPlayground: boolean
): JSX.Element[] {
	const removeItem = (nodeId) => {
		removeItemFromTree(nodeId, idToNodeMap);
	};

	const nodes: JSX.Element[] = [];

	const itemKeys = Array.from(project.keys());
	const currNodeId = currId[0];

	const tempInput = (
		<TempInput
			key={`temp-file-of-folder:${currNodeId}`}
			parentFolderId={currNodeId}
			setIsBlur={setIsBlur}
		/>
	);
	if (currNodeId !== 0) {
		nodes.push(tempInput);
	}

	itemKeys.forEach((key) => {
		if (!(project.get(key) instanceof Y.Map)) {
			return;
		}
		const curr = project.get(key) as Y.Map<unknown>;
		if (!curr.get('isFolder')) {
			// FILE
			currId[0] += 1;
			const fileKey = `treeItem:${currId[0]}`;
			// IF IT'S A PLAYGROUND DISABLE RIGHTCLICK MENU
			const file = isPlayground ? (
				<File
					key={fileKey}
					id={currId[0]}
					name={curr.get('name') as string}
					onFileClick={() => {
						onFileClick(curr);
					}}
					setIsBlur={setIsBlur}
				/>
			) : (
				<div key={fileKey}>
					<ContextMenuTrigger id={fileKey} holdToDisplay={-1}>
						<File
							id={currId[0]}
							name={curr.get('name') as string}
							onFileClick={() => {
								onFileClick(curr);
							}}
							setIsBlur={setIsBlur}
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
			const children = createTree(
				curr,
				idToNodeMap,
				currId,
				onFileClick,
				setIsBlur,
				isPlayground
			);
			const folder = isPlayground ? (
				<Folder
					key={folderKey}
					id={folderId}
					name={curr.get('name') as string}
					setIsBlur={setIsBlur}
				>
					{children}
				</Folder>
			) : (
				<div key={folderKey}>
					<ContextMenuTrigger id={folderKey} holdToDisplay={-1}>
						<Folder
							id={folderId}
							name={curr.get('name') as string}
							setIsBlur={setIsBlur}
						>
							{children}
						</Folder>
					</ContextMenuTrigger>
					<ProjectTreeCardRightClickMenu
						id={folderKey}
						nodeId={folderId}
						isFolder
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
	const { project, onFileClick, isPlayground } = props;

	const [isBlur, setIsBlur] = useState(false);

	const { idToNodeMap } = useFolderTree();

	const tree = createTree(
		project,
		idToNodeMap,
		[0],
		onFileClick,
		setIsBlur,
		isPlayground
	);

	const blurNavClassName = isBlur ? 'blurred' : '';
	return (
		<nav className={`prj-tree-nav ${blurNavClassName}`}>
			<ContextMenuTrigger id="folder-tree-root" holdToDisplay={-1}>
				<div className="tree">
					<FolderTreeProvider>
						<StrollableContainer draggable bar={LightScrollbar}>
							<StyledTree>{tree}</StyledTree>
						</StrollableContainer>
					</FolderTreeProvider>
				</div>
			</ContextMenuTrigger>
		</nav>
	);
}

FolderTree.File = File;
FolderTree.Folder = Folder;
