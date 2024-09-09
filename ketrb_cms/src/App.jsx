import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Page/Dashboard";
import NewsPage from "./Page/NewsPage";
import ImagePage from "./Page/ImagePage";
import ProgramsPage from "./Page/ProgramsPage";
import UserPage from "./Page/UserPage";
import LoginPage from "./Page/LoginPage";
import NewsAdd from "./Page/NewsAdd";
import ProgramsAdd from "./Page/ProgramsAdd";
import UserAdd from "./Page/UsersAdd";
import ProfilePage from "./Page/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <ProtectedRoute path="/" element={<Dashboard />} />
        <ProtectedRoute path="/news" element={<NewsPage />} />
        <ProtectedRoute path="/news/add news" element={<NewsAdd />} />
        <ProtectedRoute path="/images" element={<ImagePage />} />
        <ProtectedRoute path="/programs" element={<ProgramsPage />} />
        <ProtectedRoute path="/programs/add program" element={<ProgramsAdd />} />
        <ProtectedRoute path="/users" element={<UserPage />} />
        <ProtectedRoute path="/users/add users" element={<UserAdd />} />
        <ProtectedRoute path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;