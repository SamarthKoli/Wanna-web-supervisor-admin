import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * @param {children} - The page component to render if authorized
 * @param {requiredRole} - "admin" or "supervisor"
 */
const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const isApproved = localStorage.getItem('isApproved') === 'true';

    // 1. If no token, they aren't logged in at all
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check if they have the correct role for this page
    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/login" replace />;
    }

    // 3. If they are a supervisor, they MUST be approved
    if (role === 'supervisor' && !isApproved) {
        return <Navigate to="/login" replace />;
    }

    // If all checks pass, show the page
    return children;
};

export default ProtectedRoute;