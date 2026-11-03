import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AcademicPage from './pages/academic/AcademicPage'
import UsersPage from './pages/users/UsersPage'
import GradesPage from './pages/grades/GradesPage'
import LibraryPage from './pages/library/LibraryPage'
import MainLayout from './layouts/MainLayout'
import AiPage from './pages/ai/AiPage';
import MyGradesPage from './pages/grades/MyGradesPage';

function Protected({ children }) {
  const { user } = useAuth()
  return user ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/academic" element={<Protected><AcademicPage /></Protected>} />
          <Route path="/users" element={<Protected><UsersPage /></Protected>} />
          <Route path="/grades" element={<Protected><GradesPage /></Protected>} />
          <Route path="/library" element={<Protected><LibraryPage /></Protected>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/ai" element={<Protected><AiPage /></Protected>} />
          <Route path="/my-grades" element={<Protected><MyGradesPage /></Protected>} />        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}