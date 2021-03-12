import React, { useState } from 'react';
import axios from 'axios';
import './FileCreation.scss';
import './ExtensionsColor.scss';

import Extensions from './FileExtensions';

interface IFileExtensionIcon {
	extension: string;
	onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}
export function FileExtensionIcon(props: IFileExtensionIcon): JSX.Element {
	const { extension, onClick } = props;
	const logoSrc = `/logo/${extension}.png`;

	return (
		<div className="extension-icon-outer">
			<div
				id={extension}
				className={`extension-icon ${extension}`}
				onClick={onClick}
				tabIndex={0}
				role="button"
				aria-hidden="true"
			>
				<img id={extension} src={logoSrc} alt={`logo for ${extension}`} />
			</div>
			<div>{`.${extension}`}</div>
		</div>
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

	const onFileExtensionIconClick = async (
		event: React.MouseEvent<HTMLDivElement>
	) => {
		setNewFile({ ...newFile, extension: event.currentTarget.id });
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
				<button type="button" onClick={handleModalClose}>
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

				<button type="button" onClick={handleSubmit}>
					Create File
				</button>
			</div>
		</form>
	);
}
