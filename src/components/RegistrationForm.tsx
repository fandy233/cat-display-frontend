import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {

        const response = await register({ username, password });
        if (response.success) {
            alert('Registration successful! Redirecting to login page...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }else {
            alert('login failed, please try again');
        }

    };

    return (
        <div>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default RegistrationForm;