import React from 'react';
import { useNavigate } from 'react-router-dom';
import {logout} from '../services/authService';
import {useSetAtom} from "jotai/index";
import {authAtom} from "../state/authAtoms.ts";

const LogoutButton:React.FC = () => {
    const setAuth = useSetAtom(authAtom);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(setAuth); // Clear authentication state
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            alert('Login failed, please try again.');
            console.error(error);
        }

    };

    return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
