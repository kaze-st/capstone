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
	handleDeleteModalOpen: () => void;
	setCurrentProjectToShare: React.Dispatch<
		React.SetStateAction<IProjectFolder | undefined>
	>;
	setCurrentProjectToDeleteID: React.Dispatch<
		React.SetStateAction<string | null>
	>;
}

export default function ProjectFolderCardRightClickMenu(
	props: IFolderCardRightClickMenuProps
): JSX.Element {
	const {
		id,
		projectFolder,
		handleShareModalOpen,
		handleDeleteModalOpen,
		setCurrentProjectToShare,
		setCurrentProjectToDeleteID
	} = props;
	// eslint-disable-next-line
	const pid = projectFolder._id;
	const urlParams = useParams<RouteParams>();
	const projectViewPath = urlParams.ownedOrShared;

	const handleShare = () => {
		handleShareModalOpen();
		setCurrentProjectToShare(projectFolder);
	};

	const handleDelete = () => {
		handleDeleteModalOpen();
		// eslint-disable-next-line no-underscore-dangle
		setCurrentProjectToDeleteID(projectFolder._id);
	};

	return (
		<div>
			<ContextMenu id={id} className="right-click-menu">
				<Link to={`/project/${pid}`}>
					<MenuItem className="menu-item">Open Project</MenuItem>
				</Link>
				{projectViewPath === FilePath.OwnedProjects ? (
					<MenuItem onClick={handleShare} className="menu-item">
						Share Project
					</MenuItem>
				) : (
					<></>
				)}
				{projectViewPath === FilePath.OwnedProjects ? (
					<MenuItem onClick={handleDelete} className="menu-item">
						Delete Project
					</MenuItem>
				) : (
					<></>
				)}
			</ContextMenu>
		</div>
	);
}
