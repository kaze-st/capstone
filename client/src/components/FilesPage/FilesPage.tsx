import File from './File';
import Files from './Files';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
<<<<<<< HEAD
=======
import Files from './Files';
>>>>>>> c8e0b89b22f2ffb4459c8920e676c6345339cab5

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
				<button type="button" onClick={handleOnClick}>
					Log out
				</button>
			</div>
		);
	}
	return <Redirect to="/" />;
}
