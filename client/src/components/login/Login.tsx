import './login.scss';

import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Login() {
    const [ user, setUser ] = useState({ email: '', password: ''});
    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const { login } = useAuth();

    let handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({...user, email: event.target.value});
    }

    let handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUser({...user, password: event.target.value});
    }

    let handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (user.email === '' || user.password === '') {
            setError('You cannot have empty email and password');
            return;
        }

        try {
            setError('');
            setLoading(true);
            if (login) {
                await login(user.email, user.password);
            }
        } catch {
            setError('Failed to log in to your account');
        }
        setLoading(false);
    }

    return (

        <form className="login-form" onSubmit={handleSubmit}>
            <div className="header">Log Into Your Account</div>

            {error && <div>Error: {error}</div>}
            <div className="input-fields">
                <input type="text" 
                    value={user.email} 
                    placeholder="Email"
                    onChange={handleUsernameChange}
                />
                <input type="password" 
                    value={user.password}
                    placeholder="Password"
                    onChange={handlePasswordChange}
                />
            </div>
            <div className="remember-me-and-forgot-pw">
                <div>
                    <input type="checkbox" name="remember-me"></input>
                    <label htmlFor="remember-me">Keep me signed in</label>
                </div>
                <div>Forgot password?</div>
            </div>
            <button type="submit" disabled={loading} >Log In</button>
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
