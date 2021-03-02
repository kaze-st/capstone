import './Login.scss';

import { Link, Redirect } from 'react-router-dom';
import React, { useState } from 'react';

import axios from 'axios';
import firebase from 'firebase/app';
import { useAuth } from '../../contexts/AuthContext';

export function Login(): JSX.Element {
	const [userLoginDetails, setUserLoginDetails] = useState({
		email: '',
		password: '',
		isPersisted: false
	});
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const { login } = useAuth();
	const { userContext } = useAuth();

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserLoginDetails({ ...userLoginDetails, email: event.target.value });
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserLoginDetails({ ...userLoginDetails, password: event.target.value });
	};

	const handlePersistanceChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setUserLoginDetails({
			...userLoginDetails,
			isPersisted: event.target.checked
		});
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (userLoginDetails.email === '' || userLoginDetails.password === '') {
			setError('You cannot have empty email and password');
			return;
		}

		try {
			setError('');
			setIsLoading(true);
			const googleAuthPersistenceState = userLoginDetails.isPersisted
				? firebase.auth.Auth.Persistence.LOCAL
				: firebase.auth.Auth.Persistence.SESSION;
			if (login) {
				const credentials = await login(
					userLoginDetails.email,
					userLoginDetails.password,
					googleAuthPersistenceState
				);
				const url = `http://localhost:8080/api/v1/user/get-user?uid=${credentials.user?.uid}`;
				const response = await axios.get(url);
			}
		} catch {
			setError('Failed to log in to your account');
		}
		setIsLoading(false);
	};

	if (userContext !== null) {
		return <Redirect to="/files" />;
	}

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<div className="header">Log Into Your Account</div>

			{error && <div>Error: {error}</div>}
			<div className="input-fields">
				<input
					type="text"
					value={userLoginDetails.email}
					placeholder="Email"
					onChange={handleUsernameChange}
				/>
				<input
					type="password"
					value={userLoginDetails.password}
					placeholder="Password"
					onChange={handlePasswordChange}
				/>
			</div>
			<div className="remember-me-and-forgot-pw">
				<div>
					<label htmlFor="remember-me">
						<input
							type="checkbox"
							name="remember-me"
							checked={userLoginDetails.isPersisted}
							onChange={handlePersistanceChange}
						/>
						Keep me signed in
					</label>
				</div>
				<div>Forgot password?</div>
			</div>
			<button type="submit" disabled={isLoading}>
				Log In
			</button>
			<div>
				<span>
					Need an account?
					<Link to="/register">Sign Up!</Link>
				</span>
			</div>
		</form>
	);
}

export default Login;
