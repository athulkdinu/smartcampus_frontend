import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, GraduationCap, User, Shield, Briefcase } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Campus
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Campus
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-700 mb-4 font-semibold"
          >
            One Unified Platform for Students, Faculty, Administration & Placements
          </motion.p>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Streamline campus operations, enhance learning outcomes, and connect your entire educational community seamlessly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/login"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="#features"
              className="bg-white text-slate-900 px-8 py-3 rounded-xl text-base font-semibold border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              Explore Features
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Core Features
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Everything you need to manage your campus efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Student Portal",
                desc: "Access academic resources, track progress, and manage your learning journey.",
                icon: GraduationCap,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Faculty Management",
                desc: "Manage classes, assignments, and student interactions seamlessly.",
                icon: User,
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Admin Control",
                desc: "Comprehensive administrative tools for campus-wide management.",
                icon: Shield,
                gradient: "from-purple-500 to-purple-600"
              },
              {
                title: "Placement & HR Integration",
                desc: "Connect students with opportunities and manage recruitment processes.",
                icon: Briefcase,
                gradient: "from-pink-500 to-pink-600"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Role-Based Flow Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              A seamless flow connecting all campus stakeholders
            </p>
          </motion.div>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            {[
              { role: "Admin", desc: "Manages campus", icon: Shield, color: "from-cyan-500 to-blue-500" },
              { role: "Faculty", desc: "Manages academics", icon: User, color: "from-blue-500 to-indigo-500" },
              { role: "Students", desc: "Learn & grow", icon: GraduationCap, color: "from-indigo-500 to-purple-500" },
              { role: "HR", desc: "Manages placements", icon: Briefcase, color: "from-purple-500 to-pink-500" }
            ].map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="flex-1 relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg`}>
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.role}</h3>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </motion.div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-0 w-full">
                      <div className="flex items-center justify-end pr-4">
                        <ArrowRight className="w-6 h-6 text-slate-300" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Campus
                </h3>
                <p className="text-sm text-slate-500">Campus Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">About</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
            </div>
            <div className="text-sm text-slate-500">
              © 2025 Smart Campus. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
