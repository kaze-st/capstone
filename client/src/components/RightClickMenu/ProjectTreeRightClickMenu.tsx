import './RightClickMenu.scss';
import React, { useState } from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { useFolderTree } from '../FolderTree/FolderTreeContext';

interface IProjectTreeRightClickMenuProps {
	id: string;
	nodeId: number;
	isFolder: boolean;
	handleRemoveItem?: (id: number) => void;
	handleRenameItem?: (id: number, name: string) => void;
}

export default function ProjectTreeCardRightClickMenu(
	props: IProjectTreeRightClickMenuProps
): JSX.Element {
	const { id, nodeId, isFolder, handleRemoveItem, handleRenameItem } = props;

	const { setCurrDisplayedTempInput } = useFolderTree();

	const addFileById = () => {
		if (setCurrDisplayedTempInput !== undefined) {
			setCurrDisplayedTempInput({ parentFolderId: nodeId, isFolder: false });
		}
	};

	const addFolderById = () => {
		if (setCurrDisplayedTempInput !== undefined) {
			setCurrDisplayedTempInput({ parentFolderId: nodeId, isFolder: true });
		}
	};

	const removeItemById = () => {
		if (handleRemoveItem !== undefined) {
			handleRemoveItem(nodeId);
		}
	};

	const renameItemById = () => {
		if (handleRenameItem !== undefined) {
			handleRenameItem(nodeId, '');
		}
	};

	function isRootNode(): boolean {
		return nodeId === 0 || nodeId === 1;
	}

	let classNameIsFolder = isFolder ? 'big-right-click-menu' : '';
	if (isRootNode()) {
		classNameIsFolder = 'root-right-click-menu';
	}

	const addFileMenuItem = isFolder ? (
		<MenuItem
			data={{
				action: 'add-file'
			}}
			className="menu-item"
			onClick={addFileById}
		>
			New File
		</MenuItem>
	) : (
		<></>
	);

	const addFolderMenuItem = isFolder ? (
		<MenuItem
			data={{
				action: 'add-folder'
			}}
			className="menu-item"
			onClick={addFolderById}
		>
			New Folder
		</MenuItem>
	) : (
		<></>
	);

	const renameItemMenuItem = isRootNode() ? (
		<></>
	) : (
		<MenuItem
			data={{ action: 'rename' }}
			className="menu-item"
			onClick={renameItemById}
		>
			Rename
		</MenuItem>
	);

	const deleteItemMenuItem = isRootNode() ? (
		<></>
	) : (
		<MenuItem
			data={{ action: 'delete' }}
			className="menu-item"
			onClick={removeItemById}
		>
			Delete
		</MenuItem>
	);

	return (
		<div>
			<ContextMenu id={id} className={`right-click-menu ${classNameIsFolder}`}>
				{addFileMenuItem}
				{addFolderMenuItem}
				{renameItemMenuItem}
				{deleteItemMenuItem}
			</ContextMenu>
		</div>
	);
}

ProjectTreeCardRightClickMenu.defaultProps = {
	handleRemoveItem: undefined,
	handleRenameItem: undefined
};
