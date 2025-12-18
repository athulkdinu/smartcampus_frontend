import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react'
import FormInput from '../../shared/components/FormInput'
import Button from '../../shared/components/Button'
import toast from 'react-hot-toast'
import { loginAPI } from '../../services/allAPI'

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('student')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const roles = [
    { value: 'admin', label: 'Admin', icon: '👨‍💼' },
    { value: 'hr', label: 'HR', icon: '👔' },
    { value: 'student', label: 'Student', icon: '🎓' },
    { value: 'faculty', label: 'Faculty', icon: '👨‍🏫' }
  ]

  // show alert on login page after successful registration
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('registered') === 'true') {
      toast.success('Registration successful. Please login.')
    }
  }, [location.search])

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!selectedRole || !loginId || !password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      // real login api
      const response = await loginAPI(loginId.trim(), password.trim())

      if (response?.status === 200) {
        const { token, role, user, message } = response.data

        // save token and role
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('role', role)
        sessionStorage.setItem('user', JSON.stringify(user))

        // navigate based on role from backend
        toast.success(message || 'Login successful')

        const navigateRole = role || selectedRole

        if (navigateRole === 'student') {
          navigate('/student/dashboard')
        } else if (navigateRole === 'faculty') {
          navigate('/faculty/dashboard')
        } else if (navigateRole === 'admin') {
          navigate('/admin/dashboard')
        } else if (navigateRole === 'hr') {
          navigate('/hr/dashboard')
        } else {
          navigate('/')
        }
      } else {
        const status = response?.status
        const errorMessage =
          status === 400
            ? response?.data?.message || 'Invalid email or password'
            : response?.data?.message || 'Login failed. Please try again.'
        toast.error(errorMessage)
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Left Section - Hero */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(255,255,255) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-16 max-w-lg mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold leading-tight mb-6 text-center"
          >
            Welcome to
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Smart Campus
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-300 leading-relaxed text-center mb-8"
          >
            Empowering campuses with smart connectivity. Every moment matters, every login connects learning.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-slate-400"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm">Enterprise-grade security</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex w-full lg:w-1/2 justify-center items-center p-8 bg-white"
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Smart Campus</h1>
                <p className="text-sm text-slate-500">Student Portal</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
              <p className="text-slate-600">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedRole === role.value
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{role.icon}</div>
                      <div className={`text-sm font-semibold ${
                        selectedRole === role.value ? 'text-blue-700' : 'text-slate-700'
                      }`}>
                        {role.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Login ID */}
              <FormInput
                label="Login ID"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter your login ID"
                required
              />

              {/* Password */}
              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              {/* Login Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Registration Link */}
            {selectedRole === 'student' && (
              <div className="mt-6 text-center pt-6 border-t border-slate-200">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            )}

            {/* Info message for other roles */}
            {selectedRole !== 'student' && (
              <div className="mt-6 text-center pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed">
                  {selectedRole === 'admin' && 'Admin accounts are created by system administrators.'}
                  {selectedRole === 'hr' && 'HR accounts are created by administrators.'}
                  {selectedRole === 'faculty' && 'Faculty accounts are created by administrators.'}
                </p>
              </div>
            )}

            {/* Back to Home Link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center font-medium"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
