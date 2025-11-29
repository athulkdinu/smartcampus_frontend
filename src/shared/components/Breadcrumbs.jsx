import { Link, useLocation } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const Breadcrumbs = () => {
  const location = useLocation()
  const paths = location.pathname.split('/').filter(Boolean)

  const pathNames = {
    'student': 'Student',
    'admin': 'Admin',
    'faculty': 'Faculty',
    'hr': 'HR',
    'dashboard': 'Dashboard',
    'academic': 'Academic & Campus',
    'grades': 'Grades',
    'attendance': 'Attendance',
    'assignments': 'Assignments',
    'lectures': 'Lectures',
    'timetable': 'Timetable',
    'leave': 'Leave Requests',
    'exams': 'Exams',
    'complaints': 'Complaints',
    'events': 'Events',
    'messages': 'Messages',
    'notifications': 'Notifications',
    'skills': 'Skills & Learning',
    'placement': 'Placement & Internship',
    'analytics': 'Analytics & Reports',
    'profile': 'Profile',
    'help': 'Help & Support',
    'users': 'User Management',
    'campus': 'Campus Management',
    'approvals': 'Approvals',
    'settings': 'Settings',
    'students': 'Students',
    'grading': 'Grading',
    'communication': 'Communication',
    'jobs': 'Job Postings',
    'applications': 'Applications',
    'candidates': 'Candidates',
    'interviews': 'Interviews',
    'shortlisted': 'Shortlisted'
  }

  const getBreadcrumbPath = (index) => {
    return '/' + paths.slice(0, index + 1).join('/')
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
      <Link
        to={paths[0] === 'admin' ? '/admin/dashboard' : paths[0] === 'faculty' ? '/faculty/dashboard' : paths[0] === 'hr' ? '/hr/dashboard' : '/student/dashboard'}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {paths.map((path, index) => {
        const isLast = index === paths.length - 1
        const pathName = pathNames[path] || path.charAt(0).toUpperCase() + path.slice(1)
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-slate-400" />
            {isLast ? (
              <span className="text-slate-900 font-semibold">{pathName}</span>
            ) : (
              <Link
                to={getBreadcrumbPath(index)}
                className="hover:text-blue-600 transition-colors"
              >
                {pathName}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs

