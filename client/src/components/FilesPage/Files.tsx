import { Link, Redirect, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import FileCard from './FileCard';
import { Footer } from '../LandingPage/LandingPage';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

export function FileCreation(props: {
	uid: string | undefined;
	refreshPage: () => void;
}): JSX.Element {
	const [newFile, setNewFile] = useState({
		name: '',
		extension: ''
	});
	const [error, setError] = useState('');

	const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewFile({ ...newFile, name: event.target.value });
	};

	const handleExtensionChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewFile({ ...newFile, extension: event.target.value });
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			await axios.post(`${url}/api/v1/file/create-file`, {
				name: newFile.name,
				owner: props.uid,
				extension: newFile.extension
			});
			props.refreshPage();
		} catch {
			setError('Failed to create file');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>Make a new file</div>
			{error && <div>Error: {error}</div>}
			<div>
				<input
					type="text"
					value={newFile.name}
					placeholder="File Name"
					onChange={handleFileNameChange}
				/>
				<input
					type="text"
					value={newFile.extension}
					placeholder="File Extension"
					onChange={handleExtensionChange}
				/>
				<button type="submit">Create File</button>
			</div>
		</form>
	);
}

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
	// const [fileSearchName, setFileSearchName] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

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
	const recentFiles = displayFiles
		.sort((file1, file2) => {
			const date1 = new Date(file1.editedOn);
			const date2 = new Date(file2.editedOn);
			return date1.getTime() - date2.getTime();
		})
		.slice(0, 3)
		.map((file) => {
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
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		if (event.target.value === '') {
			if (fileViewPath === 'sharedFiles') {
				setDisplayFiles(allFiles.sharedFiles);
			} else {
				setDisplayFiles(allFiles.ownedFiles);
			}
		} else {
			let filesToBeFiltered;
			if (fileViewPath === 'sharedFiles') {
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

	return isLoading ? (
		<p>Loading</p>
	) : (
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
			<main>
				<div className="flex-container outer-file-container">
					<nav className="files-nav">
						<ul>
							<Link to="/files/ownedFiles">
								<li
									className={fileViewPath === 'ownedFiles' ? 'active-nav' : ''}
								>
									<img alt="" src="../img/ownedFiles.png" aria-hidden="true" />
									<div>My Files</div>
								</li>
							</Link>
							<Link to="/files/sharedFiles">
								<li
									className={fileViewPath === 'sharedFiles' ? 'active-nav' : ''}
								>
									<img alt="" src="../img/sharedFiles.png" aria-hidden="true" />
									<div>Shared Files</div>
								</li>
							</Link>
						</ul>
					</nav>
					<div className="inner-file-container">
						<h2>Recent Files</h2>
						<div className="file-container">{recentFiles}</div>
						<h2>Files</h2>
						<FileCreation uid={uid} refreshPage={getAllFiles} />
						<div className="file-container">{files}</div>
					</div>
				</div>
			</main>
			<footer>
				<p>
					&copy; CodeCollab 2021 by Khoa Luong, Thomas That, Nam Pham, and Hao
					Chen
				</p>
				<img alt="" src="../img/ischool-logo.png" aria-hidden="true" />
			</footer>
		</div>
	);
}
