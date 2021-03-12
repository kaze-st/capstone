import './RightClickMenu.scss';

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
			<ContextMenu id={id} className="right-click-menu">
				<MenuItem className="menu-item">
					<Link to={`/file/${fid}`}>Open File</Link>
				</MenuItem>
				<MenuItem onClick={handleShare} className="menu-item">
					Share File
				</MenuItem>
			</ContextMenu>
		</div>
	);
}
