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
import LoadingPage from './Page/LoadingPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('https://ketrb-backend.onrender.com/users/protected', {
          method: 'GET',
          credentials: 'include' // Include cookies with the request
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else if (response.status === 404) {
          console.log('User not found, redirecting to login.');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {

        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingPage />;
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
