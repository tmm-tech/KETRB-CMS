import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute component={Dashboard} />} />
        <Route path="/news" element={<ProtectedRoute component={NewsPage} />} />
        <Route path="/news/add-news" element={<ProtectedRoute component={NewsAdd} />} />
        <Route path="/images" element={<ProtectedRoute component={ImagePage} />} />
        <Route path="/programs" element={<ProtectedRoute component={ProgramsPage} />} />
        <Route path="/programs/add-program" element={<ProtectedRoute component={ProgramsAdd} />} />
        <Route path="/users" element={<ProtectedRoute component={UserPage} />} />
        <Route path="/users/add-users" element={<ProtectedRoute component={UserAdd} />} />
        <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
      </Routes>
    </Router>
  );
}

export default App;
