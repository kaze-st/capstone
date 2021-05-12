/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import '../FilesPage/FileCreation.scss';

import React, { useState } from 'react';
import axios from 'axios';

interface IFolderCreationDialogueProps {
	uid: string | undefined;
	refreshPage: () => void;
	handleModalClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function FolderCreationDialogue(
	props: IFolderCreationDialogueProps
): JSX.Element {
	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const { uid, refreshPage, handleModalClose } = props;
	const [hasStarterFiles, setHasStarterFiles] = useState(false);

	const [newFolder, setNewFolder] = useState({
		name: ''
	});
	const [error, setError] = useState('');

	const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewFolder({ ...newFolder, name: event.target.value });
	};

	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		if (newFolder.name === '') {
			setError('Project has to have a name!');
			return;
		}
		try {
			await axios.post(`${url}/api/v1/folder/create-folder`, {
				name: newFolder.name,
				owner: uid,
				hasStarterFiles
			});
			setNewFolder({ ...newFolder, name: '' });
			handleModalClose(event);
			refreshPage();
		} catch {
			setError('Failed to create folder');
		}
	};

	return (
		<form>
			<div className="card-creation-container">
				<button
					type="button"
					className="blue-button close-button"
					onClick={handleModalClose}
				>
					Close
				</button>
				{error && <div>Error: {error}</div>}
				<div className="card-creation-label">Project Name:</div>
				<input
					type="text"
					name="new-folder-name"
					value={newFolder.name}
					onChange={handleFileNameChange}
				/>
				<div>
					<label htmlFor="init-with-starter-files">
						<input
							type="checkbox"
							name="init-with-starter-files"
							checked={hasStarterFiles}
							onChange={() => {
								setHasStarterFiles(!hasStarterFiles);
							}}
						/>
						<span
							onClick={() => {
								setHasStarterFiles(!hasStarterFiles);
							}}
						>
							Initialize as a playground
						</span>
					</label>
				</div>
				<button
					type="button"
					className="blue-button create-file-button"
					onClick={handleSubmit}
				>
					Create Project
				</button>
			</div>
		</form>
	);
}
