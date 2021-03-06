import './Files.scss';
import '../../Spinner.scss';
import 'react-ui-tree/dist/react-ui-tree.css';

import FileCard, { RecentFileCard } from './FileCard';
import { Link, Redirect, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import FileCreationView from './FileCreationView';
import FilePath from '../../types/FilePath';
import IFile from './interfaces/IFile';
import Modal from '../Modal/Modal';
import NavBar from '../NavBar/NavBar';
import RouteParams from '../../types/RouteParams';
import ShareFileView from '../Modal/ShareView';
import SharingMode from '../Modal/SharingMode';
import Spinner from '../../Spinner';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

export default function Files(): JSX.Element {
	const [allFiles, setAllFiles] = useState({
		ownedFiles: Array<IFile>(),
		sharedFiles: Array<IFile>()
	});
	const [displayFiles, setDisplayFiles] = useState<Array<IFile>>([]);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [createFileModal, setCreateFileModal] = useState(false);
	const [shareFileModal, setShareFileModal] = useState(false);
	const [modalOpen, setModaOpen] = useState(false);
	const [modalBackgroundState, setModalBackgroundState] = useState(
		'not-dimmed'
	);

	const [currentFileToShare, setCurrentFileToShare] = useState<IFile>();

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

	const getAllFiles = async () => {
		try {
			setIsLoading(true);
			setError('');
			const result = await axios.get(`${url}/api/v1/user/files?uid=${uid}`);
			const resData = result.data;
			setAllFiles({
				ownedFiles: resData.ownedFiles,
				sharedFiles: resData.sharedFiles
			});
			if (fileViewPath === FilePath.SharedFiles) {
				setDisplayFiles(resData.sharedFiles);
			} else {
				setDisplayFiles(resData.ownedFiles);
			}
		} catch {
			setError(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		const getFiles = async () => {
			try {
				setIsLoading(true);
				setError('');
				const result = await axios.get(`${url}/api/v1/user/files?uid=${uid}`);
				const resData = result.data;
				setAllFiles({
					ownedFiles: resData.ownedFiles,
					sharedFiles: resData.sharedFiles
				});
				if (fileViewPath === FilePath.SharedFiles) {
					setDisplayFiles(resData.sharedFiles);
				} else {
					setDisplayFiles(resData.ownedFiles);
				}
			} catch {
				setError(error);
			}
			setIsLoading(false);
		};
		getFiles();
	}, [uid, fileViewPath, error]);

	const files = displayFiles.map((file) => {
		return (
			<FileCard
				// eslint-disable-next-line
				key={file._id}
				file={file}
				imageSource={`/logo/${file.extension}.png`}
				name={file.name}
				extension={file.extension}
				handleShareModalOpen={handleShareFileModalOpen}
				setCurrentFileToShare={setCurrentFileToShare}
			/>
		);
	});

	const recentFiles = [...displayFiles]
		.sort((file1, file2) => {
			const date1 = new Date(file1.lastEditedOn);
			const date2 = new Date(file2.lastEditedOn);
			return date2.getTime() - date1.getTime();
		})
		.slice(0, 3)
		.map((file) => {
			return (
				<RecentFileCard
					// eslint-disable-next-line
					key={file._id}
					imageSource={`/logo/${file.extension}.png`}
					name={file.name}
					extension={file.extension}
					file={file}
					lastEditedOn={file.lastEditedOn}
					handleShareModalOpen={handleShareFileModalOpen}
					setCurrentFileToShare={setCurrentFileToShare}
				/>
			);
		});

	const handleLogOut = async () => {
		if (logout) {
			await logout();
		}
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (event.target.value === '') {
			if (fileViewPath === FilePath.SharedFiles) {
				setDisplayFiles(allFiles.sharedFiles);
			} else {
				setDisplayFiles(allFiles.ownedFiles);
			}
		} else {
			let filesToBeFiltered;
			if (fileViewPath === FilePath.SharedFiles) {
				filesToBeFiltered = allFiles.sharedFiles;
			} else {
				filesToBeFiltered = allFiles.ownedFiles;
			}
			const ownedFileVal = filesToBeFiltered.filter((file) => {
				return file.name.includes(event.target.value);
			});
			setDisplayFiles(ownedFileVal);
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
					<input type="text" placeholder="File Name" onChange={handleSearch} />
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
										+ NEW FILE
									</button>
									<hr />
								</div>
							) : (
								<></>
							)}
							{displayFiles.length === 0 ? (
								<div className="empty-img-container">
									<img alt="" src="../img/emptyFiles.png" />
									<p>No Files Found!</p>
								</div>
							) : (
								<div>
									<h2>RECENT</h2>
									<div className="file-container">{recentFiles}</div>
									<h2>FILES</h2>
									<div className="file-container">{files}</div>
								</div>
							)}
						</div>
					)}
				</div>
				{createFileModal ? (
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
							sharingMode={SharingMode.File}
							file={currentFileToShare}
							refreshPage={getAllFiles}
							handleModalClose={handleShareFileModalClose}
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
