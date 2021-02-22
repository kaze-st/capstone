import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

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
			<Route path="/">
				<LandingPage />
			</Route>
		</Switch>
	);
}
