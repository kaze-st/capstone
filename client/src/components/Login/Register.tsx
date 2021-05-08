import './Login.scss';
import '../../Spinner.scss';

import { Link, Redirect } from 'react-router-dom';
import React, { useState } from 'react';

import Spinner from '../../Spinner';
import dotenv from 'dotenv';
import { useAuth } from '../../contexts/AuthContext';

dotenv.config();

export default function Register(): JSX.Element {
	const [newUser, setNewUser] = useState({
		email: '',
		password: '',
		firstName: '',
		lastName: '',
		confirmPassword: ''
	});

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { signUp } = useAuth();
	const { userContext } = useAuth();

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewUser({ ...newUser, email: event.target.value });
	};

	const handleFirstNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setNewUser({ ...newUser, firstName: event.target.value });
	};

	const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewUser({ ...newUser, lastName: event.target.value });
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
				await signUp(newUser);
			}
		} catch {
			setError('Failed to create an account');
		}
		setLoading(false);
	};

	if (userContext !== null) {
		return <Redirect to="/files/ownedFiles" />;
	}

	return loading ? (
		<Spinner />
	) : (
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
					type="text"
					value={newUser.firstName}
					placeholder="First Name"
					onChange={handleFirstNameChange}
				/>
				<input
					type="text"
					value={newUser.lastName}
					placeholder="Last Name"
					onChange={handleLastNameChange}
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

			<button className="blue-button" disabled={loading} type="submit">
				Create Account
			</button>

			<span>Already have an account?</span>
			<Link to="/login">Log in</Link>
		</form>
	);
}
