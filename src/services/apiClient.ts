import axios from 'axios';
import { tokenAtom } from '../atoms/authAtoms';
import { getDefaultStore } from 'jotai';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', //backend url
    headers: {
        'Content-Type': 'application/json',
    },
});

const store = getDefaultStore();

// Add token to headers if it exists
apiClient.interceptors.request.use((config) => {
    const token = store.get(tokenAtom);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;