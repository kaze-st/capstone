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
        console.log('wsup')
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
            setError('Failed to create an account');
        }
        setLoading(false);
    }

    console.log('user', user);
    
    return (
        <form className="login" onSubmit={handleSubmit}>
            <h1>Log into your Account</h1>

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
            <div>
                <input type="checkbox" name="remember-me"></input>
                <label htmlFor="remember-me">Keep me signed in</label>
            </div>
            <button type="submit" disabled={loading} >Submit</button>
            <div>
                <span>
                    Need an account?
                    <Link to="/register">Register!</Link>
                </span>
            </div>

        </form>
    );
}

export default Login;
