import { Link, Redirect, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import FileCard from './FileCard';
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
					placeholder="File name"
					onChange={handleFileNameChange}
				/>
				<input
					type="text"
					value={newFile.extension}
					placeholder="File extension"
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

	const urlParams = useParams<RouteParams>();
	const fileViewPath = urlParams.ownedOrShared;

	const { logout } = useAuth();
	const { userContext } = useAuth();

	const uid = userContext?.firebaseUser?.uid;

	const getAllFiles = async () => {
		const result = await axios.get(`${url}/api/v1/user/files?uid=${uid}`);
		const resData = result.data;
		setAllFiles({
			ownedFiles: resData.ownedFiles,
			sharedFiles: resData.sharedFiles
		});
	};
	useEffect(() => {
		const getFiles = async () => {
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
		};
		getFiles();
	}, [uid, fileViewPath]);

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

	if (userContext === null) {
		return <Redirect to="/" />;
	}

	return (
		<>
			<nav>
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
				<p>
					<Link to="/files/ownedFiles">Owned Files</Link>
					<Link to="/files/sharedFiles">Shared Files</Link>
				</p>
			</nav>
			<div>
				Files
				<FileCreation uid={uid} refreshPage={getAllFiles} />
				<div className="file-container">{files}</div>
			</div>
		</>
	);
}
