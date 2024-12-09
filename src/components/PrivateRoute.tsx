import { useAtomValue } from 'jotai';
import { Navigate } from 'react-router-dom';
import { authAtom } from '../state/authAtoms.ts';
import dayjs from 'dayjs';
import {useEffect, useState} from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const auth = useAtomValue(authAtom);
    const [isHydrated, setIsHydrated] = useState(false);

    //detect when the atom has finished hydrating
    useEffect(() => {
        if (auth !== undefined) {
            setIsHydrated(true);
        }
    }, [auth]);

    // Infer authentication status based on the presence of a valid token
    const isAuthenticated = !!auth?.token && dayjs(auth.validBefore).isAfter(dayjs());

    if (!isHydrated) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
