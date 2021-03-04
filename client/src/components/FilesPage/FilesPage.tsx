import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import FileCard from './FileCard';
import Files from './Files';

export default function FilesPage(): JSX.Element {
	const { logout } = useAuth();
	const { userContext } = useAuth();

	const handleOnClick = async () => {
		if (logout) {
			await logout();
		}
	};

	if (userContext !== null) {
		return (
			<div>
				<Files />
				<button type="submit" onClick={handleOnClick}>
					Log out
				</button>
			</div>
		);
	}
	return <Redirect to="/" />;
}
