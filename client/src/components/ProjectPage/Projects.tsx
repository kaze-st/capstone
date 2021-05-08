import '../FilesPage/Files.scss';
import '../../Spinner.scss';

import { Link, Redirect, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import IProjectFolder from './interfaces/IProjectFolder';
import Modal from '../Modal/Modal';
import RouteParams from '../../types/RouteParams';
import Spinner from '../../Spinner';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../NavBar/NavBar';
import ProjectCreationView from './ProjectCreationView';
import FilePath from '../../types/FilePath';
import ProjectCard from './ProjectCard';
import SharingMode from '../Modal/SharingMode';
import ShareFileDialogue from '../Modal/ShareView';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

export default function Folders(): JSX.Element {
	const [displayFolders, setDisplayFolders] = useState<Array<IProjectFolder>>(
		[]
	);

	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [createFolderModal, setCreateFolderModal] = useState(false);
	const [shareFolderModal, setSharedFolderModal] = useState(false);
	const [modalOpen, setModaOpen] = useState(false);
	const [modalBackgroundState, setModalBackgroundState] = useState(
		'not-dimmed'
	);

	const [
		currentProjectToShare,
		setCurrentProjectToShare
	] = useState<IProjectFolder>();

	const urlParams = useParams<RouteParams>();
	const folderViewPath = urlParams.ownedOrShared;

	const { logout } = useAuth();
	const { userContext } = useAuth();

	const uid = userContext?.firebaseUser?.uid;

	const handleCreateFileModalOpen = () => {
		setCreateFolderModal(true);
		setModaOpen(true);
		setModalBackgroundState('dimmed');
	};

	const handleCreateFolderModalClose = () => {
		setCreateFolderModal(false);
		setModaOpen(false);
		setModalBackgroundState('not-dimmed');
	};

	const handleShareFolderModalOpen = () => {
		setSharedFolderModal(true);
		setModaOpen(true);
		setModalBackgroundState('dimmed');
	};

	const handleShareFolderModalClose = () => {
		setSharedFolderModal(false);
		setModaOpen(false);
		setModalBackgroundState('not-dimmed');
	};

	const getAllFolders = async () => {
		try {
			setIsLoading(true);
			setError('');
			const result = await axios.get(`${url}/api/v1/user/folders?uid=${uid}`);
			const resData = result.data;
			if (folderViewPath === FilePath.OwnedProjects) {
				setDisplayFolders(resData.ownedFolders);
			} else if (folderViewPath === FilePath.SharedProjects) {
				setDisplayFolders(resData.sharedFolders);
			}
		} catch {
			setError(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		const getFolders = async () => {
			try {
				setIsLoading(true);
				setError('');
				const result = await axios.get(`${url}/api/v1/user/folders?uid=${uid}`);
				const resData = result.data;
				if (folderViewPath === FilePath.OwnedProjects) {
					setDisplayFolders(resData.ownedFolders);
				} else if (folderViewPath === FilePath.SharedProjects) {
					setDisplayFolders(resData.sharedFolders);
				}
			} catch {
				setError(error);
			}
			setIsLoading(false);
		};
		getFolders();
	}, [uid, folderViewPath, error]);

	const projectFolders = displayFolders
		.sort((folder1, folder2) => {
			const date1 = new Date(folder1.lastEditedOn);
			const date2 = new Date(folder2.lastEditedOn);
			return date2.getTime() - date1.getTime();
		})
		.map((folder) => {
			return (
				<ProjectCard
					// eslint-disable-next-line
					key={folder._id}
					name={folder.name}
					project={folder}
					lastEditedOn={folder.lastEditedOn}
					handleShareModalOpen={handleShareFolderModalOpen}
					setCurrentProjectToShare={setCurrentProjectToShare}
				/>
			);
		});

	const handleLogOut = async () => {
		if (logout) {
			await logout();
		}
	};

	if (userContext === null) {
		return <Redirect to="/" />;
	}

	return (
		<div className="page-wrapper">
			<header className="files-header">
				<div className="logo-and-title">
					<Link to="/">
						<img
							className="logo"
							src="../img/logo.png"
							alt="Code Collab Logo"
						/>
					</Link>
				</div>
				<form>
					<input type="text" placeholder="Project Name" onChange={() => {}} />
				</form>

				<button className="white-button" type="button" onClick={handleLogOut}>
					LOG OUT
				</button>
			</header>
			<main className={modalOpen ? 'modal-open' : ''}>
				<div
					className={`flex-container outer-file-container ${modalBackgroundState}`}
				>
					<NavBar fileViewPath={folderViewPath} />
					{isLoading ? (
						<Spinner />
					) : (
						<div className="inner-file-container">
							{folderViewPath !== 'sharedFiles' ? (
								<div className="createFile-and-filter-container">
									<button
										className="white-button"
										type="submit"
										onClick={handleCreateFileModalOpen}
									>
										+ NEW PROJECT
									</button>
									<hr />
								</div>
							) : (
								<></>
							)}
							{displayFolders.length === 0 ? (
								<div className="empty-img-container">
									<img alt="" src="../img/emptyFiles.png" />
									<p>No Projects Found!</p>
								</div>
							) : (
								<div>
									{/* <h2>RECENT</h2>
									<div className="file-container">{recentFiles}</div> */}
									<h2>PROJECTS</h2>
									<div className="file-container">{projectFolders}</div>
								</div>
							)}
						</div>
					)}
				</div>
				{createFolderModal ? (
					<Modal show={createFolderModal}>
						<ProjectCreationView
							uid={uid}
							refreshPage={getAllFolders}
							handleModalClose={handleCreateFolderModalClose}
						/>
					</Modal>
				) : (
					<></>
				)}
				{shareFolderModal ? (
					<Modal show={shareFolderModal}>
						<ShareFileDialogue
							sharingMode={SharingMode.Project}
							projectFolder={currentProjectToShare}
							refreshPage={getAllFolders}
							handleModalClose={handleShareFolderModalClose}
						/>
					</Modal>
				) : (
					<></>
				)}
			</main>
			<footer>
				<p>
					&copy; SSCode 2021 by Khoa Luong, Thomas That, Nam Pham, and Hao Chen
				</p>
				<img alt="" src="../img/ischool-logo.png" aria-hidden="true" />
			</footer>
		</div>
	);
}