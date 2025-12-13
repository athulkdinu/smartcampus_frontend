import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  GraduationCap, 
  BookOpen, 
  Briefcase, 
  User, 
  Bell, 
  HelpCircle
} from 'lucide-react'

const Sidebar = ({ isCollapsed, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/student/dashboard',
      badge: null
    },
    { 
      icon: GraduationCap, 
      label: 'Academic & Campus', 
      path: '/student/academic',
      badge: null
    },
    { 
      icon: BookOpen, 
      label: 'Skill & Learning', 
      path: '/student/skills',
      badge: null
    },
    { 
      icon: Briefcase, 
      label: 'Placement & Internship', 
      path: '/student/placement',
      badge: null
    },
    { 
      icon: User, 
      label: 'Profile & Settings', 
      path: '/student/profile',
      badge: null
    },
    { 
      icon: Bell, 
      label: 'Notifications', 
      path: '/student/academic/notifications',
      badge: null
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      path: '/student/help',
      badge: null
    }
  ]

  const isActive = (path) => {
    if (path === '/student/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '280px' }}
      className="fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white z-40 shadow-2xl border-r border-slate-700"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Smart Campus</h1>
                <p className="text-xs text-slate-400">Student Portal</p>
              </div>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mx-auto"
            >
              <GraduationCap className="w-6 h-6" />
            </motion.div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                  active 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </motion.button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-400 text-center"
            >
              © 2025 Smart Campus
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}

export default Sidebar

