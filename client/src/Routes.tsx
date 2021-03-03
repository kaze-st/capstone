import { Route, Switch } from 'react-router-dom';

import FilesPage from './components/FilesPage/FilesPage';
import LandingPage from './components/LandingPage/LandingPage';
import { Login } from './components/Login/Login';
import React from 'react';
import Register from './components/Login/Register';

export default function Routes(): JSX.Element {
	return (
		<Switch>
			<Route exact path="/login">
				<Login />
			</Route>
			<Route exact path="/register">
				<Register />
			</Route>
			<Route exact path="/">
				<LandingPage />
			</Route>
			<Route exact path="/files">
				<FilesPage />
			</Route>
		</Switch>
	);
}
