import { Redirect, Route } from 'react-router-dom';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ component: Component, ...rest }: any): JSX.Element => {
	const { userContext } = useAuth();

	return (
		<Route
			// eslint-disable-next-line
			{...rest}
			render={(props) =>
				userContext !== null ? (
					// eslint-disable-next-line
					<Component {...props} />
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

export default PrivateRoute;
