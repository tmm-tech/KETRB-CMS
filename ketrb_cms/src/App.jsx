import { Route, Routes } from "react-router-dom";
import React from "react";
import Dashboard from "./Page/Dashboard";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
