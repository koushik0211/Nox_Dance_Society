import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AdminLayout from './components/AdminLayout';

const AdminRoutes = () => {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="loading-fullscreen">Verifying Authentication...</div>;
    }

    return isLoggedIn ? (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    ) : (
        <Navigate to="/admin/login" state={{ from: location }} replace />
    );
};

export default AdminRoutes;