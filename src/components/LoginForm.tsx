import { useState } from 'react';
import { useSetAtom } from 'jotai';
import { tokenAtom } from '../atoms/authAtoms';
import { login } from '../services/authService';
import {useNavigate} from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const setToken = useSetAtom(tokenAtom);
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleLogin = async () => {
        try {
            await login({ username, password }, setToken);
            alert('Login successful!');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert('Login failed, please try again.');
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
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegisterClick}>register</button>
        </div>
    );
};

export default LoginForm;