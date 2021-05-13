/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import '../FilesPage/FileCreation.scss';

import React, { useState } from 'react';
import axios from 'axios';

interface IProjectDeletionDialogueProps {
	uid: string | undefined;
	pid: string | null;
	refreshPage: () => void;
	handleModalClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ProjectDeletionDialogue(
	props: IProjectDeletionDialogueProps
): JSX.Element {
	const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
	const { uid, pid, refreshPage, handleModalClose } = props;

	const [error, setError] = useState('');

	const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		try {
			await axios.delete(`${url}/api/v1/folder/delete-folder`, {
				data: {
					owner: uid
				},
				params: {
					pid
				}
			});
			handleModalClose(event);
			refreshPage();
		} catch {
			setError('Failed to delete folder');
		}
	};

	return (
		<form>
			<div className="card-creation-container">
				{error && <div>Error: {error}</div>}
				Do you want to delete this project?
				<div>
					<button
						type="button"
						className="blue-button close-button"
						onClick={handleSubmit}
					>
						Yes
					</button>
					<button
						type="button"
						className="blue-button close-button"
						onClick={handleModalClose}
					>
						No
					</button>
				</div>
			</div>
		</form>
	);
}
