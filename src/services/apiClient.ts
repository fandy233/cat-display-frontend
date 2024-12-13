import axios from 'axios';
import {useAtomValue, useSetAtom} from "jotai";
import {authAtom} from "../state/authAtoms.ts";
import dayjs from "dayjs";
import {useEffect} from "react";

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api', //backend url
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// for token refresh
export const refreshClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create the promise for interceptor
let isInterceptorReady = false;
let interceptorSetupPromise: Promise<void>;

export const ensureInterceptorReady = (): Promise<void> => {
    if (isInterceptorReady) {
        return Promise.resolve();
    }

    if (!interceptorSetupPromise) {
        interceptorSetupPromise = new Promise((resolve) => {
            const checkReadyInterval = setInterval(() => {
                if (isInterceptorReady) {
                    clearInterval(checkReadyInterval);
                    resolve();
                }
            }, 50); // Check every 50ms
        });
    }

    return interceptorSetupPromise;
};



// Add token to headers if it exists
export const useAxiosInterceptor = () => {
    console.log('useAxiosInterceptor called');
    const auth = useAtomValue(authAtom);
    const setAuth = useSetAtom(authAtom);


    useEffect(() => {
        console.log('Setting up Axios interceptor');

        const interceptor = apiClient.interceptors.request.use(
            async (config) => {
                const now = dayjs();
                //console.log('Current auth state:', auth);
                if (auth.token && dayjs(auth.validBefore).isAfter(now)) {
                    // Token is valid, attach to request
                    config.headers.Authorization = `Bearer ${auth.token}`;

                } else if (auth.refreshToken && dayjs(auth.refreshTokenValidBefore).isAfter(now)) {
                    // Token is expired, refresh it
                    try {
                        const response = await refreshClient.post('/auth/refresh', {
                            refreshToken: auth.refreshToken,
                        });

                        // Update authAtom with new tokens
                        const updatedAuth = {
                            ...auth,
                            token: response.data.token,
                            validBefore: response.data.validBefore,
                            refreshToken: response.data.refreshToken,
                            refreshTokenValidBefore: response.data.refreshTokenValidBefore,
                        };
                        setAuth(updatedAuth);

                        config.headers.Authorization = `Bearer ${response.data.token}`;
                    } catch (error) {
                        console.error('Token refresh failed:', error);
                        // handle logout and clear authAtom
                        setAuth({
                            token: null,
                            validBefore: null,
                            refreshToken: null,
                            refreshTokenValidBefore: null,
                            userId: null,
                            username: null,
                        });
                        throw error;
                    }
                } else {
                    console.warn('No valid token available');
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        isInterceptorReady = true;
        console.log('Axios interceptor is ready');

        return () => {
            // Cleanup the interceptor
            console.log("Clean up Axios interceptor");
            apiClient.interceptors.request.eject(interceptor);
            isInterceptorReady = false; // Reset flag
        };
    }, [auth, setAuth]);
};

export default apiClient;