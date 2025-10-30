/**
 * main.jsx - Entry point for the React application.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthContextProvider } from './contexts/AuthContext.jsx';
import { OnboardingContextProvider } from './contexts/OnboardingContext.jsx';
import { LibreViewContextProvider } from './contexts/LibreViewContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthContextProvider>
                <OnboardingContextProvider>
                    <LibreViewContextProvider>
                        <App />
                    </LibreViewContextProvider>
                </OnboardingContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    </React.StrictMode>
);
