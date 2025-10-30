/**
 * AdminRoute.jsx - Protects routes, ensuring only authenticated administrators can access them.
 */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../contexts/AuthContext.jsx';
import { ROLES } from '../../constants.js';

/**
 * @function AdminRoute
 * @summary Renders child routes if the user is an authenticated administrator, otherwise redirects.
 */
const AdminRoute = () => {
    const { user, loading } = useUser();

    if (loading) {
        return <div className="loading-message">Laden...</div>;
    }

    if (user && user.role === ROLES.ADMIN) {
        return <Outlet />;
    } else {
        return <Navigate to="/dashboard" replace />;
    }
};

export default AdminRoute;
