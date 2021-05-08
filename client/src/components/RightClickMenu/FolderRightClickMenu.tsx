import './RightClickMenu.scss';

import { ContextMenu, MenuItem } from 'react-contextmenu';
import { Link, useParams } from 'react-router-dom';

import FilePath from '../../types/FilePath';
import IProjectFolder from '../ProjectPage/interfaces/IProjectFolder';
import React from 'react';
import RouteParams from '../../types/RouteParams';

interface IFolderCardRightClickMenuProps {
	id: string;
	projectFolder: IProjectFolder;
	handleShareModalOpen: () => void;
	setCurrentProjectToShare: React.Dispatch<
		React.SetStateAction<IProjectFolder | undefined>
	>;
}

export default function FolderCardRightClickMenu(
	props: IFolderCardRightClickMenuProps
): JSX.Element {
	const {
		id,
		projectFolder,
		handleShareModalOpen,
		setCurrentProjectToShare
	} = props;
	// eslint-disable-next-line
	const fid = projectFolder._id;
	const urlParams = useParams<RouteParams>();
	const projectViewPath = urlParams.ownedOrShared;

	const handleShare = () => {
		handleShareModalOpen();
		setCurrentProjectToShare(projectFolder);
	};

	return (
		<div>
			<ContextMenu id={id} className="right-click-menu">
				<Link to={`/projects/${fid}`}>
					<MenuItem className="menu-item">Open Project</MenuItem>
				</Link>
				{projectViewPath === FilePath.OwnedProjects ? (
					<MenuItem onClick={handleShare} className="menu-item">
						Share Project
					</MenuItem>
				) : (
					<></>
				)}
			</ContextMenu>
		</div>
	);
}
