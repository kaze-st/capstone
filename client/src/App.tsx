import './App.scss';
import './components/Login/Login';
import './index.scss';

import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import Routes from './Routes';

function App(): JSX.Element {
	return (
		<div className="page-wrapper">
			<AuthProvider>
				<BrowserRouter>
					<div className="App">
						<Routes />
					</div>
				</BrowserRouter>
			</AuthProvider>
		</div>
	);
}
export default App;
