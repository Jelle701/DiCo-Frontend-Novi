/**
 * PublicRoute.jsx - Manages access to public routes, redirecting authenticated users to their appropriate dashboards.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import { ROLES } from '../../constants.js';

/**
 * @function PublicRoute
 * @summary Renders child routes if unauthenticated, or redirects authenticated users based on their role.
 */
const PublicRoute = ({ children }) => {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();

    if (authLoading || userLoading) {
        return <div className="loading-fallback-message">Laden...</div>;
    }

    if (isAuth) {
        if (!user || !user.role) {
            return <Navigate to="/onboarding/role" replace />;
        }

        let intendedStartPath = '/';

        switch (user.role) {
            case ROLES.ADMIN:
                intendedStartPath = '/admin-dashboard';
                break;
            case ROLES.PATIENT:
                intendedStartPath = '/dashboard';
                break;
            case ROLES.GUARDIAN:
                if (user.linkedPatients && user.linkedPatients.length > 0) {
                    intendedStartPath = '/guardian-portal';
                } else {
                    intendedStartPath = '/onboarding/link-patient';
                }
                break;
            case ROLES.PROVIDER:
                intendedStartPath = '/provider-dashboard';
                break;
            default:
                intendedStartPath = '/';
        }
        return <Navigate to={intendedStartPath} replace />;
    }

    return children;
};

export default PublicRoute;
