import './App.scss';
import './components/Login/Login';
import './index.scss';

import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Routes from './Routes';

function App(): JSX.Element {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes />
			</BrowserRouter>
		</AuthProvider>
	);
}
export default App;
