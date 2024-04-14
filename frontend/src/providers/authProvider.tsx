'use client'
import React, { useState, useEffect, useContext, createContext } from "react";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";
import { User } from "../modules/users/type";
import Loading from "@/components/loading/loading";
import { jwtDecode } from "jwt-decode";

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

        const userString = getCookie("USER_INFO");
        if (token && userString) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userString));
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const login = (access_token: string, user: User) => {
        setCookie('ACCESS_TOKEN', access_token, { expires: 1, secure: true });
        setCookie('USER_INFO', JSON.stringify(user), { expires: 1, secure: true })
        setUser(user);
        setIsLoggedIn(true);
    };

    const logout = () => {
        removeCookie('ACCESS_TOKEN');
        removeCookie('USER_INFO')
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
