import './App.scss';
import './components/login/Login.tsx';
import './index.css';

// import LandingPage from './LandingPage/LandingPage'
import React from 'react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
          <div className="App">
            <Routes/>
          </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
