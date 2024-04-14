'use client'
import React, { useState, useEffect, useContext, createContext } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";
import { User } from "../modules/users/type";

// Outside AuthProvider:
const AuthContext = createContext<{
    isLoggedIn: boolean;
    user: null | User;
    login: (token: string, user: User) => void;
    logout: () => void;
}>({
    isLoggedIn: false,
    user: null,
    login: (token: string, user: User) => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        setLoading(true);
        const token = getCookie('ACCESS_TOKEN');
        const userString = getCookie("USER");
        if (token && userString) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userString));
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const login = (access_token: string, user: User) => {
        if (access_token) {
            setCookie('ACCESS_TOKEN', access_token, { expires: 1 });
            setCookie('USER', JSON.stringify(user), { expires: 1 })
            setIsLoggedIn(true);
        }
    };

    const logout = () => {
        removeCookie('ACCESS_TOKEN');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
