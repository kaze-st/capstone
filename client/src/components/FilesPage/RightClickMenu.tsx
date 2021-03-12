import './RightClickMenu.scss';

import { ContextMenu, MenuItem } from 'react-contextmenu';

import IFile from './interfaces/IFile';
import { Link } from 'react-router-dom';
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
	// eslint-disable-next-line
	const fid = file._id;

	const handleShare = () => {
		handleShareModalOpen();
		setCurrentFileToShare(file);
	};

	return (
		<div>
			<ContextMenu id={id} className="right-click-menu">
				<Link to={`/file/${fid}`}>
					<MenuItem className="menu-item">Open File</MenuItem>
				</Link>
				<MenuItem onClick={handleShare} className="menu-item">
					Share File
				</MenuItem>
			</ContextMenu>
		</div>
	);
}
