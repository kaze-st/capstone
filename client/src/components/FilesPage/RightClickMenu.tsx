import { ContextMenu, MenuItem } from 'react-contextmenu';

import { Link } from 'react-router-dom';
import IFile from './interfaces/IFile';
import React from 'react';

interface ICardRightClickMenuProps {
	id: string;
	file: IFile;
	handleShareModalOpen: () => void;
	setCurrentFileToShare: React.Dispatch<
		React.SetStateAction<IFile | undefined>
	>;
}

export default function CardRightClickMenu(
	props: ICardRightClickMenuProps
): JSX.Element {
	const { id, file, handleShareModalOpen, setCurrentFileToShare } = props;
	const fid = id;

	const handleShare = () => {
		console.log(`/file/${fid}`);
		handleShareModalOpen();
		setCurrentFileToShare(file);
	};

	return (
		<div>
			{/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
			{/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}
			<ContextMenu id={id}>
				<MenuItem>
					<Link to={`/file/${fid}`}>Open File</Link>
				</MenuItem>
				<MenuItem onClick={handleShare}>Share File</MenuItem>
			</ContextMenu>
		</div>
	);
}
