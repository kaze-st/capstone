
import './App.scss';
import './components/login/Login.tsx';
import './index.css';

import LandingPage from './LandingPage/LandingPage'
import React from 'react';
import Routes from './routes';
import { BrowserRouter  } from 'react-router-dom'; 

import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <div className="App">
            <Routes/>
          </div>
      </BrowserRouter>
    </AuthProvider>

export default App;
