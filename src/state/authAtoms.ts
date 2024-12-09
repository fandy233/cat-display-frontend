import { atomWithStorage } from 'jotai/utils';

export interface AuthState {
    token?: string | null;
    validBefore?: string | null;
    refreshToken?: string | null;
    refreshTokenValidBefore?: string | null;
    role?: string | null;
    userId?: string | null;
    username?: string | null;
}

export const authAtom = atomWithStorage<AuthState>('auth-state', {});

//Transforms the backend response into a standardized AuthState format
export function fromCredentials(loginResponse: {
    token: string;
    validBefore: string;
    refreshToken: string;
    refreshTokenValidBefore: string;
    userInfo: {
        id: string;
        userName: string;
    };

}): AuthState {
    return {
        token: loginResponse.token,
        validBefore: loginResponse.validBefore,
        refreshToken: loginResponse.refreshToken,
        refreshTokenValidBefore: loginResponse.refreshTokenValidBefore,
        userId: loginResponse.userInfo.id,
        username: loginResponse.userInfo.userName,
    };
}

