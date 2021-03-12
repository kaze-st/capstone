import './FileCreation.scss';
import './ExtensionsColor.scss';

import React, { useState } from 'react';

import Extensions from './FileExtensions';
import axios from 'axios';

interface IFileExtensionIcon {
	extension: string;
	onClick: (event: React.MouseEvent<HTMLInputElement>) => void;
}
export function FileExtensionIcon(props: IFileExtensionIcon): JSX.Element {
	const { extension, onClick } = props;
	const logoSrc = `/logo/${extension}.png`;

	return (
		<label htmlFor={extension.toString()} className="extension-icon-outer">
			<input
				type="radio"
				name="extension"
				value={extension}
				onClick={onClick}
				id={extension}
			/>
			<div className={`extension-icon ${extension}`}>
				<img id={extension} src={logoSrc} alt={`logo for ${extension}`} />
			</div>
			<div>{`.${extension}`}</div>
		</label>
	);
}

interface IFileCreationProps {
	uid: string | undefined;
	refreshPage: () => void;
	handleModalClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FileCreation(props: IFileCreationProps): JSX.Element {
	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const { uid, refreshPage, handleModalClose } = props;

	const [newFile, setNewFile] = useState({
		name: '',
		extension: ''
	});
	const [error, setError] = useState('');

	const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewFile({ ...newFile, name: event.target.value });
	};

	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		try {
			await axios.post(`${url}/api/v1/file/create-file`, {
				name: newFile.name,
				owner: uid,
				extension: newFile.extension
			});
			handleModalClose(event);
			refreshPage();
		} catch {
			setError('Failed to create file');
		}
	};

	const onFileExtensionIconClick = async (event) => {
		setNewFile({ ...newFile, extension: event.target.value });
	};

	const extensions = Object.values(Extensions) as string[];
	const ExtensionsIcon = extensions.map((extension) => {
		return (
			<FileExtensionIcon
				key={extension}
				extension={extension}
				onClick={onFileExtensionIconClick}
			/>
		);
	});
	return (
		<form>
			{error && <div>Error: {error}</div>}
			<div className="card-creation-container">
				<button
					type="button"
					className="blue-button close-button"
					onClick={handleModalClose}
				>
					Close
				</button>
				<div className="card-creation-label">File Name:</div>
				<input
					type="text"
					name="new-file-name"
					value={newFile.name}
					onChange={handleFileNameChange}
				/>
				<div className="card-creation-label">File Type:</div>
				<div className="extension-icons-container">{ExtensionsIcon}</div>

				<button
					type="button"
					className="blue-button create-file-button"
					onClick={handleSubmit}
				>
					Create File
				</button>
			</div>
		</form>
	);
}
