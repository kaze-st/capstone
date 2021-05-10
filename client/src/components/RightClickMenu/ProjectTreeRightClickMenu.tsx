import './RightClickMenu.scss';
import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

interface IProjectTreeRightClickMenuProps {
	id: string;
	nodeId: number;
	isFolder: boolean;
	handleAddFile?: (id: number) => void;
	handleAddFolder?: (id: number) => void;
	handleRemoveItem?: (id: number) => void;
}

export default function ProjectTreeCardRightClickMenu(
	props: IProjectTreeRightClickMenuProps
): JSX.Element {
	const {
		id,
		nodeId,
		isFolder,
		handleAddFile,
		handleAddFolder,
		handleRemoveItem
	} = props;

	const addFileById = () => {
		if (handleAddFile !== undefined) {
			handleAddFile(nodeId);
		}
	};

	const addFolderById = () => {
		if (handleAddFolder !== undefined) {
			handleAddFolder(nodeId);
		}
	};

	const removeItemById = () => {
		if (handleRemoveItem !== undefined) {
			handleRemoveItem(nodeId);
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
				<MenuItem data={{ action: 'rename' }} className="menu-item">
					Rename
				</MenuItem>
				{deleteItemMenuItem}
			</ContextMenu>
		</div>
	);
}

ProjectTreeCardRightClickMenu.defaultProps = {
	handleAddFile: undefined,
	handleAddFolder: undefined,
	handleRemoveItem: undefined
};
