/**
 * LibreViewContext.jsx - Provides LibreView session management to the application.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';

const LibreViewContext = createContext(null);

/**
 * @function LibreViewContextProvider
 * @summary Manages the LibreView session state, including login and logout.
 */
export function LibreViewContextProvider({ children }) {
    const [session, setSession] = useState(() => {
        try {
            const storedSession = sessionStorage.getItem('libreview_session');
            return storedSession ? JSON.parse(storedSession) : null;
        } catch (error) {
            return null;
        }
    });

    useEffect(() => {
        if (session) {
            sessionStorage.setItem('libreview_session', JSON.stringify(session));
        } else {
            sessionStorage.removeItem('libreview_session');
        }
    }, [session]);

    /**
     * @function login
     * @summary Sets the LibreView session data.
     */
    const login = (sessionData) => {
        setSession(sessionData);
    };

    /**
     * @function logout
     * @summary Clears the LibreView session data.
     */
    const logout = () => {
        setSession(null);
    };

    const value = {
        session,
        isLoggedIn: !!session,
        login,
        logout,
    };

    return (
        <LibreViewContext.Provider value={value}>
            {children}
        </LibreViewContext.Provider>
    );
}

/**
 * @function useLibreView
 * @summary Hook to access LibreView session state and actions.
 */
export const useLibreView = () => {
    const context = useContext(LibreViewContext);
    if (!context) {
        throw new Error('useLibreView must be used within a LibreViewContextProvider');
    }
    return context;
};
