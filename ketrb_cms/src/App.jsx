import { Route, Routes } from "react-router-dom";
import React from "react";
import Dashboard from "./Page/Dashboard";
import NewsPage from "./Page/NewsPage";
import ImagePage from "./Page/ImagePage";
import ProgramsPage from "./Page/ProgramsPage";
import UserPage from "./Page/UserPage";
import LoginPage from "./Page/LoginPage";
import NewsAdd from "./Page/NewsAdd";
import ProgramsAdd from "./Page/ProgramsAdd";
import UserAdd from "./Page/UsersAdd";
import SettingPage from "./Page/SettingPage";
import ProfilePage from "./Page/ProfilePage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/add news" element={<NewsAdd />} />
        <Route path="/images" element={<ImagePage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/add program" element={<ProgramsAdd />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/users/add users" element={<UserAdd />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={<SettingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
