import React from 'react';
import { Link } from 'react-router-dom';
import FilePath from '../../types/FilePath';

export default function NavBar(props: { fileViewPath: string }): JSX.Element {
	const { fileViewPath } = props;
	return (
		<nav className="files-nav">
			<ul>
				<Link to="/files/ownedFiles">
					<li
						className={fileViewPath === FilePath.OwnedFiles ? 'active-nav' : ''}
					>
						<img alt="" src="../img/ownedFiles.png" aria-hidden="true" />
						<div>My Files</div>
					</li>
				</Link>
				<Link to="/files/sharedFiles">
					<li
						className={
							fileViewPath === FilePath.SharedFiles ? 'active-nav' : ''
						}
					>
						<img alt="" src="../img/sharedFiles.png" aria-hidden="true" />
						<div>Shared Files</div>
					</li>
				</Link>
				<Link to="/projects/ownedProjects">
					<li
						className={
							fileViewPath === FilePath.OwnedProjects ? 'active-nav' : ''
						}
					>
						<img alt="" src="../img/ownedFolders.png" aria-hidden="true" />
						<div>My Projects</div>
					</li>
				</Link>
				<Link to="/projects/sharedProjects">
					<li
						className={
							fileViewPath === FilePath.SharedProjects ? 'active-nav' : ''
						}
					>
						<img alt="" src="../img/sharedFolders.png" aria-hidden="true" />
						<div>Shared Projects</div>
					</li>
				</Link>
			</ul>
		</nav>
	);
}
