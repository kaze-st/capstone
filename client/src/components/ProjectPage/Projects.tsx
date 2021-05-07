import '../FilesPage/Files.scss';
import '../../Spinner.scss';

import { Link, Redirect, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import IFolder from './interfaces/IFolder';
import Modal from '../Modal/Modal';
import RouteParams from '../../types/RouteParams';
import Spinner from '../../Spinner';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../NavBar/NavBar';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

export default function Folders(): JSX.Element {
	const [displayFolders, setDisplayFolders] = useState<Array<IFolder>>([]);

	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [createFileModal, setCreateFileModal] = useState(false);
	const [shareFileModal, setShareFileModal] = useState(false);
	const [modalOpen, setModaOpen] = useState(false);
	const [modalBackgroundState, setModalBackgroundState] = useState(
		'not-dimmed'
	);

	const urlParams = useParams<RouteParams>();
	const fileViewPath = urlParams.ownedOrShared;

	const { logout } = useAuth();
	const { userContext } = useAuth();

	const uid = userContext?.firebaseUser?.uid;

	const handleCreateFileModalOpen = () => {
		setCreateFileModal(true);
		setModaOpen(true);
		setModalBackgroundState('dimmed');
	};

	const handleCreateFileModalClose = () => {
		setCreateFileModal(false);
		setModaOpen(false);
		setModalBackgroundState('not-dimmed');
	};

	const handleShareFileModalOpen = () => {
		setShareFileModal(true);
		setModaOpen(true);
		setModalBackgroundState('dimmed');
	};

	const handleShareFileModalClose = () => {
		setShareFileModal(false);
		setModaOpen(false);
		setModalBackgroundState('not-dimmed');
	};

	const folders = [];

	useEffect(() => {
		const getFiles = async () => {
			try {
				setIsLoading(true);
				setError('');
				const result = await axios.get(`${url}/api/v1/user/files?uid=${uid}`);
				const resData = result.data;
			} catch {
				setError(error);
			}
			setIsLoading(false);
		};
		getFiles();
	}, [uid, fileViewPath, error]);

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
					<NavBar fileViewPath={fileViewPath} />
					{isLoading ? (
						<Spinner />
					) : (
						<div className="inner-file-container">
							{fileViewPath !== 'sharedFiles' ? (
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
									<div className="file-container">{folders}</div>
								</div>
							)}
						</div>
					)}
				</div>
				{/* {createFileModal ? (
					<Modal show={createFileModal}>
						<FileCreationView
							uid={uid}
							refreshPage={getAllFiles}
							handleModalClose={handleCreateFileModalClose}
						/>
					</Modal>
				) : (
					<></>
				)}
				{shareFileModal ? (
					<Modal show={shareFileModal}>
						<ShareFileView
							file={currentFileToShare}
							refreshPage={getAllFiles}
							handleModalClose={handleShareFileModalClose}
						/>
					</Modal>
				) : (
					<></>
				)} */}
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
