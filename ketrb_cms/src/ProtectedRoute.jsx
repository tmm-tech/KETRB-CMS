import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

const ProtectedRoute = ({ element: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            element={
                isAuthenticated() ? (
                    Component
                ) : (
                    <Navigate to="/login" />
                )
            }
        />
    );
};

export default ProtectedRoute;