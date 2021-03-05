import { Link, Redirect, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import FileCard from './FileCard';
import FileCreation from './FileCreation';
import Modal from './Modal';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

import './Files.scss';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

interface IFileViewFile {
	_id: string;
	name: string;
	createdOn: string;
	editedOn: string;
	owner: string;
	extension: string;
}

interface RouteParams {
	ownedOrShared: string;
}

export default function Files(): JSX.Element {
	const [allFiles, setAllFiles] = useState({
		ownedFiles: Array<IFileViewFile>(),
		sharedFiles: Array<IFileViewFile>()
	});
	const [displayFiles, setDisplayFiles] = useState<Array<IFileViewFile>>([]);
	const [fileSearchName, setFileSearchName] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [modalBackgroundState, setModalBackgroundState] = useState(
		'not-dimmed'
	);

	const urlParams = useParams<RouteParams>();
	const fileViewPath = urlParams.ownedOrShared;

	const { logout } = useAuth();
	const { userContext } = useAuth();

	const uid = userContext?.firebaseUser?.uid;

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
			if (fileViewPath === 'sharedFiles') {
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
				if (fileViewPath === 'sharedFiles') {
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
				imageSource={`/logo/${file.extension}.png`}
				name={file.name}
				extension={file.extension}
			/>
		);
	});

	const handleLogOut = async () => {
		if (logout) {
			await logout();
		}
	};

	const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFileSearchName(event.target.value);
	};

	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (fileSearchName === '') {
			if (fileViewPath === 'sharedFiles') {
				setDisplayFiles(allFiles.sharedFiles);
			} else {
				setDisplayFiles(allFiles.ownedFiles);
			}
		} else {
			const ownedFileVal = displayFiles.filter((file) => {
				return file.name.includes(fileSearchName);
			});
			setDisplayFiles(ownedFileVal);
		}
	};

	const handleModalOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setModal(true);
		setModalBackgroundState('dimmed');
	};

	const handleModalClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		setModal(false);
		setModalBackgroundState('not-dimmed');
	};

	if (userContext === null) {
		return <Redirect to="/" />;
	}

	return (
		<>
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
				<form onSubmit={handleSearch}>
					<input
						type="text"
						value={fileSearchName}
						placeholder="file name"
						onChange={handleSearchInput}
					/>
					<button type="submit">search</button>
				</form>

				<button type="button" onClick={handleLogOut}>
					Log out
				</button>
				<nav>
					<p>
						<Link to="/files/ownedFiles">Owned Files</Link>
						<Link to="/files/sharedFiles">Shared Files</Link>
					</p>
				</nav>
			</header>
			<div className={modalBackgroundState}>
				<button type="submit" onClick={handleModalOpen}>
					Create File
				</button>

				{isLoading ? (
					<p>Loading</p>
				) : (
					<div className="file-container">{files}</div>
				)}
			</div>
			<Modal show={modal}>
				<FileCreation
					uid={uid}
					refreshPage={getAllFiles}
					handleModalClose={handleModalClose}
				/>
			</Modal>
		</>
	);
}
