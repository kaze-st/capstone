import CurrentDoc from '../CurrentDoc/CurrentDoc';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
			<>
				<button type="submit" onClick={handleOnClick}>
					Log out
				</button>
				<CurrentDoc />
			</>
		);
	}
	return <Redirect to="/" />;
}
