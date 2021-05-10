import './RightClickMenu.scss';
import React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';

interface IProjectTreeRightClickMenuProps {
	id: string;
	nodeId: number;
	isFolder: boolean;
	handleAddFile: (id: number) => void;
}

export default function ProjectTreeCardRightClickMenu(
	props: IProjectTreeRightClickMenuProps
): JSX.Element {
	const { id, nodeId, isFolder, handleAddFile } = props;

	const addFileById = () => {
		console.log('adding file to', nodeId);
		handleAddFile(nodeId);
	};

	const classNameIsFolder = isFolder ? 'big-right-click-menu' : '';
	return (
		<div>
			<ContextMenu id={id} className={`right-click-menu ${classNameIsFolder}`}>
				{isFolder ? (
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
				)}
				{isFolder ? (
					<MenuItem
						data={{
							action: 'add-folder'
						}}
						className="menu-item"
					>
						New Folder
					</MenuItem>
				) : (
					<></>
				)}
				<MenuItem data={{ action: 'rename' }} className="menu-item">
					Rename
				</MenuItem>
				<MenuItem data={{ action: 'delete' }} className="menu-item">
					Delete
				</MenuItem>
			</ContextMenu>
		</div>
	);
}
