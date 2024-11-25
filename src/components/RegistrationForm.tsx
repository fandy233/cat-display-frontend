import React, { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {

        const response = await register({ username, password });
        console.log("hello");
        if (response.success) {
            alert('registration successfully!');
        }else {
            alert('registration failed, please try again');
        }

    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-sm" style={{maxWidth: '400px', width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)',}}>
                <h3 className="text-center mb-4">Register</h3>
                <form onSubmit={handleRegister}>
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
                        Register</button>
                    <button type="button" className="btn btn-link w-100 text-center" onClick={() => navigate('/login')}>
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;