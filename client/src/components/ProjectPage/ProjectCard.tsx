import '../FilesPage/FileCard.scss';
import '../FilesPage/ExtensionsColor.scss';

import { ContextMenuTrigger } from 'react-contextmenu';
import IProjectFolder from './interfaces/IProjectFolder';
import { Link } from 'react-router-dom';
import ProjectFolderCardRightClickMenu from '../RightClickMenu/FolderRightClickMenu';
import React from 'react';

interface IProjectCardProp {
	name: string;
	lastEditedOn: string;
	project: IProjectFolder;
	handleShareModalOpen: () => void;
	handleDeleteModalOpen: () => void;
	setCurrentProjectToShare: React.Dispatch<
		React.SetStateAction<IProjectFolder | undefined>
	>;
	setCurrentProjectToDeleteID: React.Dispatch<
		React.SetStateAction<string | null>
	>;
}

export default function ProjectCard(props: IProjectCardProp): JSX.Element {
	const {
		name,
		lastEditedOn,
		project,
		handleShareModalOpen,
		handleDeleteModalOpen,
		setCurrentProjectToShare,
		setCurrentProjectToDeleteID
	} = props;
	// eslint-disable-next-line
	const pid = project._id;
	const date = new Date(lastEditedOn);
	return (
		<div>
			<ContextMenuTrigger id={pid}>
				<Link to={`/project/${pid}`}>
					<div className="file-card recent-file">
						<div className="file-card-img-container">
							<img src="../img/folder.png" alt="folder" />
						</div>
						<div className="file-card-name">
							<p>{name}</p>
							<p>Last edited on {date.toLocaleString()}</p>
						</div>
					</div>
				</Link>
			</ContextMenuTrigger>
			<ProjectFolderCardRightClickMenu
				projectFolder={project}
				id={pid}
				handleShareModalOpen={handleShareModalOpen}
				handleDeleteModalOpen={handleDeleteModalOpen}
				setCurrentProjectToShare={setCurrentProjectToShare}
				setCurrentProjectToDeleteID={setCurrentProjectToDeleteID}
			/>
		</div>
	);
}
