import { Route, Routes } from "react-router-dom";
import React from "react";
import Dashboard from "./Page/Dashboard";
import NewsPage from "./Page/NewsPage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/news" element={<NewsPage />} />
      </Routes>
    </div>
  );
}

export default App;
