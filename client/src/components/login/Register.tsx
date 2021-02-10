import './login.scss';

import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function Register(){

    const [ newUser, setNewUser ] = useState({ 
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [ error, setError ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const { signUp } = useAuth();

    let handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({...newUser, email: event.target.value});
    }

    let handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({...newUser, password: event.target.value});
    }

    let handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({...newUser, confirmPassword: event.target.value});
    }

    let handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();       

        if (newUser.password !== newUser.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            setError('');
            setLoading(true);
            if (signUp) {
                await signUp(newUser.email, newUser.password);
            }
        } catch {
            setError('Failed to create an account');
        }
        setLoading(false);
    }

    return(
        <form className="Login"  onSubmit={handleSubmit}>
            <div className="header">Create your account</div>

            {error && <div>Error: {error}</div>}

            <div className="input-fields">
                <input type="text" 
                    value={newUser.email}
                    placeholder="Email Address"
                    onChange={handleEmailChange}
                />
                <input type="password" 
                    value={newUser.password}
                    placeholder="Password"
                    onChange={handlePasswordChange}
                />
                <input type="password" 
                    value={newUser.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={handleConfirmPasswordChange}
                />
            </div>

            <button disabled={loading} type ="submit">Create Account</button>

            <span>Already have an account?</span>
            <Link to="/login">Log in</Link>


        </form>
    );
}