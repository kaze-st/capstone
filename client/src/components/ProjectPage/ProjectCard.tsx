import '../FilesPage/FileCard.scss';
import '../FilesPage/ExtensionsColor.scss';

import ProjectFolderCardRightClickMenu from '../RightClickMenu/FolderRightClickMenu';
import { ContextMenuTrigger } from 'react-contextmenu';
import IProjectFolder from './interfaces/IProjectFolder';
import { Link } from 'react-router-dom';
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
	const fid = project._id;
	const date = new Date(lastEditedOn);
	return (
		<div>
			<ContextMenuTrigger id={fid}>
				<Link to={`/projects/${fid}`}>
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
				id={fid}
				handleShareModalOpen={handleShareModalOpen}
				setCurrentProjectToShare={setCurrentProjectToShare}
			/>
		</div>
	);
}