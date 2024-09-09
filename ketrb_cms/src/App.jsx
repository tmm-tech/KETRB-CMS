import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/news" element={<ProtectedRoute element={<NewsPage />} />} />
                <Route path="/news/add-news" element={<ProtectedRoute element={<NewsAdd />} />} />
                <Route path="/images" element={<ProtectedRoute element={<ImagePage />} />} />
                <Route path="/programs" element={<ProtectedRoute element={<ProgramsPage />} />} />
                <Route path="/programs/add-program" element={<ProtectedRoute element={<ProgramsAdd />} />} />
                <Route path="/users" element={<ProtectedRoute element={<UserPage />} />} />
                <Route path="/users/add-users" element={<ProtectedRoute element={<UserAdd />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
            </Routes>
        </Router>
    );
}

export default App;