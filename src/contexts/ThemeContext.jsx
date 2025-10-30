/**
 * ThemeContext.jsx - Provides theme management (light/dark mode) for the application.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * @function ThemeProvider
 * @summary Manages the application's theme state and applies it to the document body.
 */
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    /**
     * @function toggleTheme
     * @summary Toggles the current theme between 'light' and 'dark'.
     */
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const value = {
        theme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * @function useTheme
 * @summary Hook to access the current theme and the toggleTheme function.
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
