import React, { useEffect, useState } from 'react';

import IFile from './interfaces/IFile';
import axios from 'axios';

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
	return <div>{`Name: ${name} ${lastName}. Email: ${email}`} </div>;
}

interface IShareFileDialog {
	file: IFile | undefined;
	refreshPage: () => void;
	handleModalClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function ShareFileDialog(props: IShareFileDialog): JSX.Element {
	const { file, refreshPage, handleModalClose } = props;

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
				const result = await axios.post(`${url}/api/v1/user/get-users`, {
					uids: file?.sharedTo
				});
				const resData = result.data;
				console.log(resData);
				const currCollaborators = resData.map((user) => {
					return {
						name: user.name,
						lastName: user.lastName,
						email: user.email
					};
				});
				setCurrentCollaborators(currCollaborators);
			} catch (e) {
				setError('Failed to get users');
			}
		};
		getCurrentCollaborators();
	}, [file]);

	if (file === undefined) {
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
			setError('Failed to find user');
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
			const fid = file._id;
			await axios.post(`${url}/api/v1/file/share-file-multiple-receivers`, {
				owner: file.owner,
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
					Share File To Pending Collaborators
				</button>
			</div>
		</form>
	);
}
