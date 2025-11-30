import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './comman/pages/LandingPage'
import LoginPage from './comman/pages/LoginPage'
import StudentRegisterPage from './comman/pages/StudentRegisterPage'
import StudentDashboard from './students/pages/StudentDashboard'
import AcademicCampus from './students/pages/AcademicCampus'
import GradesPage from './students/pages/academic/GradesPage'
import AttendancePage from './students/pages/academic/AttendancePage'
import AssignmentsPage from './students/pages/academic/AssignmentsPage'
import LecturesPage from './students/pages/academic/LecturesPage'
import LeavePage from './students/pages/academic/LeavePage'
import ExamsPage from './students/pages/academic/ExamsPage'
import ComplaintsPage from './students/pages/academic/ComplaintsPage'
import EventsPage from './students/pages/academic/EventsPage'
import MessagesPage from './students/pages/academic/MessagesPage'
import NotificationsPage from './students/pages/academic/NotificationsPage'
import SkillsPage from './students/pages/SkillsPage'
import PlacementPage from './students/pages/PlacementPage'
import ProfilePage from './students/pages/ProfilePage'
import HelpPage from './students/pages/HelpPage'
import AdminDashboard from './admin/pages/AdminDashboard'
import AdminUserManagement from './admin/pages/AdminUserManagement'
import AdminEventManagement from './admin/pages/AdminEventManagement'
import AdminClassManagement from './admin/pages/AdminClassManagement'
import AdminComplaintManagement from './admin/pages/AdminComplaintManagement'
import AdminCommunicationCenter from './admin/pages/AdminCommunicationCenter'
import AdminExamManagement from './admin/pages/AdminExamManagement'
import HRDashboard from './hr/pages/HRDashboard'
import HRCreateJob from './hr/pages/HRCreateJob'
import HRManageJobs from './hr/pages/HRManageJobs'
import HRViewApplications from './hr/pages/HRViewApplications'
import HRShortlisted from './hr/pages/HRShortlisted'
import HRInterviewSchedule from './hr/pages/HRInterviewSchedule'
import HRResults from './hr/pages/HRResults'
import FacultyDashboard from './faculty/pages/FacultyDashboard'
import AcademicManagement from './faculty/pages/AcademicManagement'
import FacultyStudents from './faculty/pages/FacultyStudents'
import GradingWorkspace from './faculty/pages/GradingWorkspace'
import AttendanceControl from './faculty/pages/AttendanceControl'
import CommunicationHub from './faculty/pages/CommunicationHub'
import FacultyNotifications from './faculty/pages/FacultyNotifications'
import FacultyLeaveRequests from './faculty/pages/FacultyLeaveRequests'
import FacultyComplaints from './faculty/pages/FacultyComplaints'
import FacultyEventRequests from './faculty/pages/FacultyEventRequests'
import FacultyAssignments from './faculty/pages/FacultyAssignments'
import './App.css'
import ProtectedRoute from './shared/components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<StudentRegisterPage />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/student/academic" element={<AcademicCampus />} />
        <Route path="/student/academic/grades" element={<GradesPage />} />
        <Route path="/student/academic/attendance" element={<AttendancePage />} />
        <Route path="/student/academic/assignments" element={<AssignmentsPage />} />
        <Route path="/student/academic/lectures" element={<LecturesPage />} />
        <Route path="/student/academic/leave" element={<LeavePage />} />
        <Route path="/student/academic/exams" element={<ExamsPage />} />
        <Route path="/student/academic/complaints" element={<ComplaintsPage />} />
        <Route path="/student/academic/events" element={<EventsPage />} />
        <Route path="/student/academic/messages" element={<MessagesPage />} />
        <Route path="/student/academic/notifications" element={<NotificationsPage />} />
        <Route path="/student/skills" element={<SkillsPage />} />
        <Route path="/student/placement" element={<PlacementPage />} />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/student/help" element={<HelpPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminEventManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/classes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminClassManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminComplaintManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/communication"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCommunicationCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminExamManagement />
            </ProtectedRoute>
          }
        />
        
        {/* Faculty Routes */}
        <Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/academic" element={<AcademicManagement />} />
        <Route path="/faculty/assignments" element={<FacultyAssignments />} />
        <Route path="/faculty/students" element={<FacultyStudents />} />
        <Route path="/faculty/grading" element={<GradingWorkspace />} />
        <Route path="/faculty/attendance" element={<AttendanceControl />} />
        <Route path="/faculty/communication" element={<CommunicationHub />} />
        <Route path="/faculty/notifications" element={<FacultyNotifications />} />
        <Route path="/faculty/leave-requests" element={<FacultyLeaveRequests />} />
        <Route path="/faculty/complaints" element={<FacultyComplaints />} />
        <Route path="/faculty/event-requests" element={<FacultyEventRequests />} />
        
        {/* HR Routes */}
        <Route path="/hr" element={<Navigate to="/hr/dashboard" replace />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/create-job" element={<HRCreateJob />} />
        <Route path="/hr/manage-jobs" element={<HRManageJobs />} />
        <Route path="/hr/applications" element={<HRViewApplications />} />
        <Route path="/hr/shortlisted" element={<HRShortlisted />} />
        <Route path="/hr/interviews" element={<HRInterviewSchedule />} />
        <Route path="/hr/results" element={<HRResults />} />
      </Routes>
    </Router>
  )
}

export default App

