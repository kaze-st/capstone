import './Login.scss';

import { Link, Redirect } from 'react-router-dom';
import React, { useState } from 'react';

import axios from 'axios';
import dotenv from 'dotenv';
import { useAuth } from '../../contexts/AuthContext';

dotenv.config();

export default function Register(): JSX.Element {
	const [newUser, setNewUser] = useState({
		email: '',
		password: '',
		confirmPassword: ''
	});

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { signUp } = useAuth();
	const { userContext } = useAuth();

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewUser({ ...newUser, email: event.target.value });
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewUser({ ...newUser, password: event.target.value });
	};

	const handleConfirmPasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewUser({ ...newUser, confirmPassword: event.target.value });
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (newUser.password !== newUser.confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		try {
			setError('');
			setLoading(true);
			if (signUp) {
				const credentials = await signUp(newUser.email, newUser.password);
				const url = process.env.REACT_APP_CODE_COLLAB_API_BASE_URL;
				await axios.post(`${url}/api/v1/user/create-user`, {
					uid: credentials.user?.uid,
					name: 'firstName',
					lastName: 'lastName'
				});
			}
		} catch {
			setError('Failed to create an account');
		}
		setLoading(false);
	};

	if (userContext !== null) {
		return <Redirect to="/files" />;
	}

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<div className="header">Create your account</div>

			{error && <div>Error: {error}</div>}

			<div className="input-fields">
				<input
					type="text"
					value={newUser.email}
					placeholder="Email Address"
					onChange={handleEmailChange}
				/>
				<input
					type="password"
					value={newUser.password}
					placeholder="Password"
					onChange={handlePasswordChange}
				/>
				<input
					type="password"
					value={newUser.confirmPassword}
					placeholder="Confirm Password"
					onChange={handleConfirmPasswordChange}
				/>
			</div>

			<button disabled={loading} type="submit">
				Create Account
			</button>

			<span>Already have an account?</span>
			<Link to="/login">Log in</Link>
		</form>
	);
}
