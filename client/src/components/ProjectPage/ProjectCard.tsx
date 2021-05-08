import '../FilesPage/FileCard.scss';
import '../FilesPage/ExtensionsColor.scss';

import { ContextMenuTrigger } from 'react-contextmenu';
import IProjectFolder from './interfaces/IProjectFolder';
import { Link } from 'react-router-dom';
import ProjectFolderCardRightClickMenu from '../RightClickMenu/FolderRightClickMenu';
import React from 'react';

interface IFileCardProp {
	name: string;
	lastEditedOn: string;
	project: IProjectFolder;
	handleShareModalOpen: () => void;
	setCurrentProjectToShare: React.Dispatch<
		React.SetStateAction<IProjectFolder | undefined>
	>;
}

export default function ProjectCard(props: IFileCardProp): JSX.Element {
	const {
		name,
		lastEditedOn,
		project,
		handleShareModalOpen,
		setCurrentProjectToShare
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
				setCurrentProjectToShare={setCurrentProjectToShare}
			/>
		</div>
	);
}
