import apiClient from './apiClient';
import {AuthState, fromCredentials} from "../state/authAtoms.ts";

interface Credentials {
    username: string;
    password: string;
}

export const login = async (credentials: { username: string; password: string }, setAuth: (auth: AuthState) => void): Promise<void> => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        const authState = fromCredentials(response.data); // Transform login response
        setAuth(authState); // Persist authentication state
        console.log("set token", response.data.token);
    } catch (error) {
        console.error('Login failed', error);
        throw error;
    }
};

export const register = async (credentials: Credentials): Promise<{ success: boolean; message?: string }> => {
    try {
        await apiClient.post('/auth/register', credentials);
        return { success: true };
    } catch (error) {
        console.error('Registration failed', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
};

export const logout = async (setAuth: (auth: AuthState) => void): Promise<void> => {
    try {
        await apiClient.post('/auth/logout');
    } catch (error) {
        console.error('Error during logout:', error);
    }
    // Clear authAtom state
    setAuth({
        token: null,
        validBefore: null,
        refreshToken: null,
        refreshTokenValidBefore: null,
        userId: null,
        username: null,
    });

    // Clear localStorage
    localStorage.removeItem('auth-state');
};
