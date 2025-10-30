/**
 * PrivateRoute.jsx - Protects routes, ensuring only authenticated users with proper onboarding and roles can access them.
 */
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '../../contexts/AuthContext.jsx';
import { ROLES } from '../../constants.js';

/**
 * @function normalizeRole
 * @summary Normalizes a user role string.
 */
const normalizeRole = (role) => {
    if (typeof role !== 'string') return null;
    let normalized = role.toUpperCase();
    if (normalized.startsWith('ROLE_')) {
        normalized = normalized.substring(5);
    }
    return normalized;
};

const ONBOARDING_ROUTES = [
    '/onboarding/role',
    '/onboarding/preferences',
    '/onboarding/medicine',
    '/onboarding/devices',
];

const FIRST_ONBOARDING_STEP = '/onboarding/role';

/**
 * @function PrivateRoute
 * @summary Renders child routes if the user is authenticated and authorized, otherwise redirects.
 */
const PrivateRoute = () => {
    const { isAuth, loading: authLoading } = useAuth();
    const { user, loading: userLoading } = useUser();
    const location = useLocation();

    if (authLoading || userLoading) {
        return <div className="loading-fallback-message">Laden...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user) {
        return <div className="loading-fallback-message">Gebruikersprofiel ophalen...</div>;
    }

    const userRole = normalizeRole(user.role);
    const currentPath = location.pathname;

    // Admins should bypass onboarding checks
    if (userRole === ROLES.ADMIN) {
        return <Outlet />;
    }

    const isFullyOnboarded = user?.flags?.hasDetails;
    const isTryingToAccessOnboarding = ONBOARDING_ROUTES.includes(currentPath);

    if (!isFullyOnboarded) {
        if (!isTryingToAccessOnboarding) {
            return <Navigate to={FIRST_ONBOARDING_STEP} replace />;
        }
        return <Outlet />;
    }

    if (isFullyOnboarded) {
        if (isTryingToAccessOnboarding) {
            let homePath = '/';
            switch (userRole) {
                case ROLES.PATIENT:
                    homePath = '/dashboard';
                    break;
                case ROLES.PROVIDER:
                    homePath = '/provider-dashboard';
                    break;
                case ROLES.GUARDIAN:
                    homePath = '/guardian-portal';
                    break;
                default:
                    homePath = '/';
            }
            return <Navigate to={homePath} replace />;
        }
    }

    if (userRole === ROLES.PROVIDER && currentPath === '/dashboard') {
         return <Navigate to="/provider-dashboard" replace />;
    }
    
    if (userRole === ROLES.PATIENT && (currentPath === '/provider-dashboard' || currentPath === '/patient-portal' || currentPath === '/guardian-portal')) {
         return <Navigate to="/dashboard" replace />;
    }

    if (userRole === ROLES.GUARDIAN && (currentPath === '/dashboard' || currentPath === '/provider-dashboard' || currentPath === '/patient-portal')) {
        return <Navigate to="/guardian-portal" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
