import './Collaborator.scss';

import React, { useEffect, useState } from 'react';

import IFile from '../FilesPage/interfaces/IFile';
import axios from 'axios';
import SharingMode from './SharingMode';
import IProjectFolder from '../ProjectPage/interfaces/IProjectFolder';

const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
/*
	TODO: The collaborators consist of 2 groups:
	Pending collaborator and already collaborator.
	We should be careful about how to display them. RIght now we have to query the database 
	since the file's sharedTo field only contains uid.
*/

interface ICollaborator {
	name: string;
	lastName: string;
	email: string;
	uid: string;
}

export function Collaborator(props: ICollaborator): JSX.Element {
	const { name, lastName, email, uid } = props;
	return (
		<div className="collaborator-container">
			<img src="../img/user.png" alt="user-avatar" />
			<div className="collaborator-names-container">
				<div className="collaborator-name">{`${name} ${lastName}`}</div>
				<div>{`${email}`}</div>
			</div>
		</div>
	);
}

interface IShareDialog {
	sharingMode: SharingMode;
	file?: IFile | undefined;
	projectFolder?: IProjectFolder | undefined;
	refreshPage: () => void;
	handleModalClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ShareFileDialog(props: IShareDialog): JSX.Element {
	const {
		sharingMode,
		file,
		projectFolder,
		refreshPage,
		handleModalClose
	} = props;

	console.log(props);

	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [pendingCollaborators, setPendingCollaborators] = useState<
		Array<ICollaborator>
	>([]);
	const [currentCollaborators, setCurrentCollaborators] = useState<
		Array<ICollaborator>
	>([]);

	useEffect(() => {
		const getCurrentCollaborators = async () => {
			try {
				setError('');

				let uids = new Array<string>();
				if (sharingMode === SharingMode.File) {
					uids = file?.sharedTo as Array<string>;
				} else if (sharingMode === SharingMode.Project) {
					uids = projectFolder?.sharedTo as Array<string>;
				}

				const result = await axios.post(`${url}/api/v1/user/get-users`, {
					uids
				});
				const resData = result.data;

				const currCollaborators = resData.map((user) => {
					return {
						name: user.name,
						lastName: user.lastName,
						email: user.email,
						uid: user.uid
					};
				});
				setCurrentCollaborators(currCollaborators);
			} catch (e) {
				setError('Failed to get users');
			}
		};
		getCurrentCollaborators();
	}, [file, projectFolder, sharingMode]);

	if (sharingMode === SharingMode.File && file === undefined) {
		return <></>;
	}

	if (sharingMode === SharingMode.Project && projectFolder === undefined) {
		return <></>;
	}

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const addNewPendingCollaborators = (pendingCollaborator: ICollaborator) => {
		let temp = pendingCollaborators;
		temp = temp.filter((user) => {
			return user.email !== pendingCollaborator.email;
		});
		temp.push(pendingCollaborator);
		setPendingCollaborators(temp);
	};

	const handleGetUserByEmail = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		try {
			setError('');
			const result = await axios.get(`${url}/api/v1/user/get-user-email`, {
				params: {
					email
				}
			});
			const user = result.data;

			const userObj: ICollaborator = {
				name: user.name,
				lastName: user.lastName,
				email: user.email,
				uid: user.uid
			};

			addNewPendingCollaborators(userObj);

			setEmail('');
		} catch {
			setError('No user associated with that email. Please use a valid email.');
		}
	};

	const handleAddAllPendingCollaborators = async (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault();
		try {
			setError('');
			const receivers = pendingCollaborators.map((collaborator) => {
				return collaborator.uid;
			});

			// eslint-disable-next-line
			let fid = file?._id;
			let sharingMultipleReceiverUrls = `${url}/api/v1/file/share-file-multiple-receivers`;
			let owner = file?.owner;
			if (sharingMode === SharingMode.Project) {
				// eslint-disable-next-line
				fid = projectFolder?._id;
				sharingMultipleReceiverUrls = `${url}/api/v1/folder/share-folder-multiple-receivers`;
				owner = projectFolder?.owner;
			}

			await axios.post(sharingMultipleReceiverUrls, {
				owner,
				receivers,
				fid
			});
			setPendingCollaborators([]);
			handleModalClose(event);
			refreshPage();
		} catch {
			setError('Failed to share to user');
		}
	};

	const pendingCollaboratorsCards = pendingCollaborators.map((collaborator) => {
		return (
			<Collaborator
				key={collaborator.uid}
				name={collaborator.name}
				lastName={collaborator.lastName}
				email={collaborator.email}
				uid={collaborator.uid}
			/>
		);
	});

	const currCollaboratorsCards = currentCollaborators.map((collaborator) => {
		return (
			<Collaborator
				key={collaborator.uid}
				name={collaborator.name}
				lastName={collaborator.lastName}
				email={collaborator.email}
				uid={collaborator.uid}
			/>
		);
	});

	return (
		<form>
			<div className="card-creation-container">
				<button
					type="button"
					className="blue-button close-button"
					onClick={handleModalClose}
				>
					CLOSE
				</button>
				{error && <div>Error: {error}</div>}

				<div className="who-do-share-with">Who do you want to share with?</div>
				<input
					type="text"
					value={email}
					placeholder="Email"
					onChange={handleEmailChange}
				/>
				<button
					type="button"
					className="blue-button add-button"
					onClick={handleGetUserByEmail}
				>
					ADD
				</button>
				<div>
					<p className="card-creation-label">Current Collaborators:</p>
					{currCollaboratorsCards}
				</div>
				<div>
					<p className="card-creation-label">Pending Collaborators:</p>
					{pendingCollaboratorsCards}
				</div>
				<button
					type="button"
					className="blue-button"
					onClick={handleAddAllPendingCollaborators}
				>
					{sharingMode === SharingMode.File
						? 'Share File To Pending Collaborators'
						: 'Share Project To Pending Collaborators'}
				</button>
			</div>
		</form>
	);
}

ShareFileDialog.defaultProps = {
	file: undefined,
	projectFolder: undefined
};
