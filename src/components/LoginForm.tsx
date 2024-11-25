import React, { useState } from 'react';
import { useSetAtom } from 'jotai';
import { tokenAtom } from '../atoms/authAtoms';
import { login } from '../services/authService';
import {useNavigate} from "react-router-dom";

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setToken = useSetAtom(tokenAtom);
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login({ username, password }, setToken);
            alert('Login successful!');
            // Navigate to user dashboard after successful login
            //navigate('/dashboard');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('Login failed, please try again.');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)',}}>
                <h3 className="text-center mb-4">Login</h3>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-100 mb-3" style={{ backgroundColor: '#8B5E3C', color: '#FFF9F3', border: 'none' }}>
                        Login</button>
                    <button type="button" className="btn btn-link w-100" onClick={() => navigate('/register')}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;