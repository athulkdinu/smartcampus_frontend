import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Users,
  CheckCircle2,
  CalendarCheck,
  Trophy,
  Briefcase
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Breadcrumbs from '../components/Breadcrumbs'
import { Toaster } from 'react-hot-toast'

const HRLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/hr/dashboard' },
    { icon: FilePlus, label: 'Create Job', path: '/hr/create-job' },
    { icon: ClipboardList, label: 'Manage Jobs', path: '/hr/manage-jobs' },
    { icon: Users, label: 'Applications', path: '/hr/applications' },
    { icon: CheckCircle2, label: 'Shortlisted', path: '/hr/shortlisted' },
    { icon: CalendarCheck, label: 'Interview Schedule', path: '/hr/interviews' },
    { icon: Trophy, label: 'Results', path: '/hr/results' }
  ]

  const isActive = (path) => {
    if (path === '/hr/dashboard') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04142c] via-[#08213e] to-[#0c2d4f]">
      <Toaster position="top-right" />
      
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? '80px' : '280px' }}
        className="fixed left-0 top-0 h-full bg-gradient-to-b from-[#0b1f33] via-[#0f2947] to-[#133457] text-white z-40 shadow-2xl border-r border-cyan-500/20 hidden lg:block"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/40">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Smart Campus</h1>
                  <p className="text-xs text-amber-100/80">HR Portal</p>
                </div>
              </motion.div>
            )}
            {sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-10 h-10 bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mx-auto"
              >
                <Briefcase className="w-6 h-6" />
              </motion.div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-amber-100/80 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <div key={item.path} className="relative group">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active 
                      ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white shadow-lg shadow-amber-500/40' 
                      : 'text-amber-100/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                    )}
                  </motion.button>
                  {sidebarCollapsed && (
                    <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1 rounded-lg bg-[#061529] text-white text-xs opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition">
                      {item.label}
                    </span>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </motion.aside>

      <div
        className="transition-all duration-300"
        style={{ 
          marginLeft: isMobile ? '0' : (sidebarCollapsed ? '80px' : '280px')
        }}
      >
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  )
}

export default HRLayout

