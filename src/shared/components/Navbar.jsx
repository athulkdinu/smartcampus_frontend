import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bell, User, LogOut, Settings, GraduationCap } from 'lucide-react'
import { useState, useEffect } from 'react'

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Detect role from pathname
  const getRoleInfo = () => {
    const path = location.pathname
    if (path.startsWith('/admin')) {
      return { 
        role: 'Admin', 
        id: 'ADM2024', 
        initial: 'A', 
        dashboard: '/admin/dashboard',
        notificationPath: '/admin/communication'
      }
    } else if (path.startsWith('/faculty')) {
      return { 
        role: 'Faculty', 
        id: 'FAC2024', 
        initial: 'F', 
        dashboard: '/faculty/dashboard',
        notificationPath: '/faculty/communication'
      }
    } else if (path.startsWith('/hr')) {
      return { 
        role: 'HR Manager', 
        id: 'HR2024', 
        initial: 'H', 
        dashboard: '/hr/dashboard',
        notificationPath: '/hr/communication'
      }
    } else {
      return { 
        role: 'Student', 
        id: 'STU2024', 
        initial: 'S', 
        dashboard: '/student/dashboard',
        notificationPath: '/student/academic/notifications'
      }
    }
  }

  const roleInfo = getRoleInfo()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* Smart Campus Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Smart Campus
              </h1>
              <p className="text-xs text-slate-500 hidden md:block">Campus Management System</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Time */}
          <div className="hidden lg:block text-right border-r border-slate-200 pr-4">
            <div className="text-sm font-semibold text-slate-900">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-slate-500">
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* Notifications */}
          <button 
            onClick={() => navigate(roleInfo.notificationPath)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
          >
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {roleInfo.initial}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-semibold text-slate-900">{roleInfo.role}</div>
                <div className="text-xs text-slate-500">ID: {roleInfo.id}</div>
              </div>
            </button>

            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate(`${roleInfo.dashboard.replace('/dashboard', '/profile')}`)
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigate(`${roleInfo.dashboard.replace('/dashboard', '/settings')}`)
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-700">Settings</span>
                </button>
                <div className="border-t border-slate-200 my-2"></div>
                <button
                  onClick={() => {
                    navigate('/login')
                    setShowProfileMenu(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-left text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar

