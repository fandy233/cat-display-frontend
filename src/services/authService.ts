import apiClient from './apiClient';

interface Credentials {
    username: string;
    password: string;
}

export const login = async (credentials: Credentials, setToken: (token: string | null) => void): Promise<void> => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        setToken(response.data.token); // Set the token in the atom
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

export const logout = (setToken: (token: string | null) => void): void => {
    setToken(null); // Clear token from the atom
};