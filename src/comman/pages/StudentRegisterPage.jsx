import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { registerAPI } from '../../services/allAPI'

const StudentRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email,
        password: formData.password,
        role: 'student',
        phone: formData.phone || undefined,
        department: formData.department || undefined
      }

      const response = await registerAPI(payload)

      if (response?.status === 201) {
        toast.success('Registration successful. Please login.')
        navigate('/login?registered=true')
      } else {
        const message = response?.data?.message || 'Registration failed. Please try again.'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Section - Branded Area */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex-col justify-center items-center text-white p-16">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(255,255,255) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Your Campus Journey<br />
            Starts Here
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Register today to connect, learn, and grow with Smart Campus.
          </p>
        </div>
      </div>

      {/* Right Section - Registration Form */}
      <div className="flex w-full lg:w-1/2 justify-center items-center relative p-8 bg-white overflow-y-auto">
        {/* Registration Card */}
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl p-10 my-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block p-3 bg-gray-100 rounded-lg mb-4">
              <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Student Registration
            </h2>
            <p className="text-gray-600 text-sm">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2.5">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all font-medium ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2.5">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all font-medium ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2.5">
                  Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number (optional)"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all font-medium ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {/* phone optional, no error */}
              </div>
            </div>

            {/* Department (optional) */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2.5">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all font-medium border-gray-300"
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2.5">
                  Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all font-medium ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2.5">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all font-medium ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-semibold hover:text-gray-700 hover:underline transition-colors">
                Login here
              </Link>
            </p>
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center font-medium"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentRegisterPage
