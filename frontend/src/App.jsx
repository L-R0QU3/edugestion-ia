import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AcademicPage from './pages/academic/AcademicPage'
import UsersPage from './pages/users/UsersPage'
import GradesPage from './pages/grades/GradesPage'
import MyGradesPage from './pages/grades/MyGradesPage'
import LibraryPage from './pages/library/LibraryPage'
import AiPage from './pages/ai/AiPage'
import GuardianPage from './pages/guardian/GuardianPage'
import AttendancePage from './pages/attendance/AttendancePage'
import MyAttendancePage from './pages/attendance/MyAttendancePage'
import AnnotationsPage from './pages/annotations/AnnotationsPage'
import CommunicationsPage from './pages/communications/CommunicationsPage'
import SchedulesPage from './pages/schedules/SchedulesPage'
import MainLayout from './layouts/MainLayout'
import CoexistencePage from './pages/coexistence/CoexistencePage';

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
          <Route path="/my-grades" element={<Protected><MyGradesPage /></Protected>} />
          <Route path="/library" element={<Protected><LibraryPage /></Protected>} />
          <Route path="/ai" element={<Protected><AiPage /></Protected>} />
          <Route path="/guardian" element={<Protected><GuardianPage /></Protected>} />
          <Route path="/attendance" element={<Protected><AttendancePage /></Protected>} />
          <Route path="/my-attendance" element={<Protected><MyAttendancePage /></Protected>} />
          <Route path="/communications" element={<Protected><CommunicationsPage /></Protected>} />
          <Route path="/annotations" element={<Protected><AnnotationsPage /></Protected>} />
          <Route path="/schedules" element={<Protected><SchedulesPage /></Protected>} />
          <Route path="/coexistence" element={<Protected><CoexistencePage /></Protected>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}