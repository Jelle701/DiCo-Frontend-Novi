/**
 * AuthContext.jsx - Provides authentication state and user data to the application.
 */
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { getMyProfile } from '../services/ProfileService.jsx';

const AuthContext = createContext(null);

/**
 * @function AuthContextProvider
 * @summary Manages authentication token, user profile, and authentication status.
 */
export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    /**
     * @function logout
     * @summary Clears authentication data and resets state.
     */
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('delegatedToken');
        sessionStorage.removeItem('patientUsername');
        setToken(null);
        setUser(null);
        setIsAuth(false);
        setLoading(false);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initializeAuth = async () => {
            if (token) {
                if (isMounted) setLoading(true);
                try {
                    const { data, error } = await getMyProfile();

                    if (!isMounted) {
                        return;
                    }

                    if (error) {
                        logout();
                    } else {
                        setUser(data);
                        setIsAuth(true);
                    }
                } catch (err) {
                    if (isMounted) {
                        logout();
                    }
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                setUser(null);
                setIsAuth(false);
                setLoading(false);
            }
        };

        initializeAuth();

        return () => {
            isMounted = false;
        };
    }, [token, logout]);

    /**
     * @function login
     * @summary Sets the authentication token and triggers re-authentication.
     */
    const login = useCallback((jwt) => {
        localStorage.setItem('token', jwt);
        setToken(jwt);
    }, []);

    /**
     * @function setUserData
     * @summary Updates the user profile data and sets authentication status.
     */
    const setUserData = useCallback((profile) => {
        setUser(profile);
        setIsAuth(true);
        setLoading(false);
    }, []);

    const contextValue = useMemo(() => ({
        token,
        isAuth,
        user,
        loading,
        login,
        logout,
        setUserData,
    }), [token, isAuth, user, loading, login, logout, setUserData]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * @function useAuth
 * @summary Hook to access authentication status, login, and logout functions.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }
    return {
        isAuth: context.isAuth,
        loading: context.loading,
        login: context.login,
        logout: context.logout,
    };
};

/**
 * @function useUser
 * @summary Hook to access user profile data and update it.
 */
export const useUser = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useUser must be used within an AuthContextProvider');
    }
    return {
        user: context.user,
        setUserData: context.setUserData,
        loading: context.loading,
    };
};
