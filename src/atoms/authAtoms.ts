import { atomWithStorage } from 'jotai/utils';

// Atom to store the authentication token
export const tokenAtom = atomWithStorage<string | null>('token', null);