import './App.scss';
import './components/login/Login.tsx';
import './index.scss';

import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import React from 'react';
import Routes from './routes';

function App() {
  return (
    <div className="page-wrapper">
    <AuthProvider>
      <BrowserRouter>
          <div className="App">
            <Routes/>
          </div>
      </BrowserRouter>
    </AuthProvider>
    </div>
  );
}
export default App;