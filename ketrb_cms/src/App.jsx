import { Route, Routes, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Dashboard from './Page/Dashboard';
import NewsPage from './Page/NewsPage';
import ImagePage from './Page/ImagePage';
import ProgramsPage from './Page/ProgramsPage';
import UserPage from './Page/UserPage';
import LoginPage from './Page/LoginPage';
import NewsAdd from './Page/NewsAdd';
import ProgramsAdd from './Page/ProgramsAdd';
import UserAdd from './Page/UsersAdd';
import ProfilePage from './Page/ProfilePage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://ketrb-backend.onrender.com/users/check-auth', {
          method: 'GET',
          credentials: 'include' // Include cookies with the request
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/add-news" element={<NewsAdd />} />
            <Route path="/images" element={<ImagePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/programs/add-program" element={<ProgramsAdd />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/users/add-users" element={<UserAdd />} />
            <Route path="/profile" element={<ProfilePage />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
