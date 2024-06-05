'use client'
import React, { useState, useEffect, useContext, createContext, useCallback } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";
import { User } from "../modules/users/type";
import { getMyProfile } from "@/modules/users/services";

// Outside AuthProvider:
const AuthContext = createContext<{
    isLoggedIn: boolean;
    user: null | User;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
}>({
    isLoggedIn: false,
    user: null,
    login: (token: string, user: User) => { },
    logout: () => { },
    loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = getCookie('ACCESS_TOKEN');
        if (token) {
            getMyProfile().then((res) => {
                if (res.status && res.status.code === 200) {
                    setIsLoggedIn(true);
                    setUser(res.data[0]);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
                setLoading(false);
            });
        } else {
            setIsLoggedIn(false);
            setUser(null);
            setLoading(false);
        }
    }, []);

    const login = useCallback((access_token: string, user: User) => {
        setCookie('ACCESS_TOKEN', access_token, { expires: 1, secure: true });
        setUser(user);
        setIsLoggedIn(true);
    }, []);

    const logout = useCallback(() => {
        removeCookie('ACCESS_TOKEN');
        removeCookie('USER_INFO');
        setIsLoggedIn(false);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
