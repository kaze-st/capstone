import FileCard from './FileCard';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;

export function FileCreation(props: { uid: string | undefined }): JSX.Element {
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
				.
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
export default function Files(): JSX.Element {
	const [allFiles, setAllFiles] = useState({
		ownedFiles: Array<IFileViewFile>(),
		sharedFiles: Array<IFileViewFile>()
	});
	const { userContext } = useAuth();

	const uid = userContext?.firebaseUser?.uid;
	useEffect(() => {
		const getAllFiles = async () => {
			const result = await axios.get(`${url}/api/v1/user/files?uid=${uid}`);
			const resData = result.data;
			setAllFiles({
				ownedFiles: resData.ownedFiles,
				sharedFiles: resData.sharedFiles
			});
		};
		getAllFiles();
	}, [uid]);

	const files = allFiles.ownedFiles.map((file) => {
		return (
			<FileCard
				imageSource={`/logo/${file.extension}.png`}
				name={file.name}
				extension={file.extension}
			/>
		);
	});
	return (
		<div>
			Files
			<FileCreation uid={uid} />
			<div className="file-container">{files}</div>
		</div>
	);
}
