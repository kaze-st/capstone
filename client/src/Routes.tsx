import { Redirect, Route, Switch } from 'react-router-dom';

import CurrentDoc from './components/CurrentDoc/CurrentDoc';
import Files from './components/FilesPage/Files';
import LandingPage from './components/LandingPage/LandingPage';
import { Login } from './components/Login/Login';
import PrivateRoute from './components/shared/PrivateRoute';
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
			<PrivateRoute exact path="/files/:ownedOrShared" component={Files} />
			<PrivateRoute exact path="/file/:fid" component={CurrentDoc} />

			{/* <Redirect exact to="/" /> */}
		</Switch>
	);
}
