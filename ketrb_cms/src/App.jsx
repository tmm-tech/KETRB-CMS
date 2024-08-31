import { Route, Routes } from "react-router-dom";
import React from "react";
import Dashboard from "./Page/Dashboard";
import NewsPage from "./Page/NewsPage";
import ImagePage from "./Page/ImagePage";
import ProgramsPage from "./Page/ProgramsPage";
import UserPage from "./Page/UserPage";
import LoginPage from "./Page/LoginPage";
import NewsAdd from "./Page/NewsAdd";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/images" element={<ImagePage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/users" element={<UserPage />} />
        <Route path="/addnews" element={<NewsAdd />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
