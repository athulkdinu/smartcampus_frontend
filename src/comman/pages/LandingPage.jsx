import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Users, Shield, Zap, TrendingUp, CheckCircle2, Star } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Campus
                </h1>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About</a>
              <a href="#benefits" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Benefits</a>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-semibold rounded-full border border-blue-200/50 shadow-sm">
              <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
              Enterprise Campus Management Platform
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Transform Your Campus
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Management Experience
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            A comprehensive, enterprise-grade platform designed to streamline operations, 
            enhance learning outcomes, and connect your entire campus community seamlessly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/login"
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl text-base font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="bg-white text-slate-900 px-10 py-4 rounded-xl text-base font-bold border-2 border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Stats Preview */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {[
              { number: '10+', label: 'Departments' },
              { number: '150+', label: 'Faculty' },
              { number: '5K+', label: 'Students' },
              { number: '400+', label: 'Daily Classes' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + idx * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center text-slate-400">
            <span className="text-xs font-medium mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      {/* <section id="features" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Why Choose Smart Campus?
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade solutions designed for modern educational institutions. 
              Streamline operations, enhance learning, and empower your campus community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Smart Scheduling",
                desc: "AI-powered class scheduling and real-time availability management for optimal resource utilization.",
                icon: <Zap className="w-8 h-8" />,
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "Secure Platform",
                desc: "Enterprise-grade security with encrypted data storage and multi-factor authentication.",
                icon: <Shield className="w-8 h-8" />,
                gradient: "from-green-500 to-green-600"
              },
              {
                title: "Unified Records",
                desc: "Centralized academic records management for students, faculty, and administrators.",
                icon: <BookOpen className="w-8 h-8" />,
                gradient: "from-indigo-500 to-indigo-600"
              },
              {
                title: "Real-time Updates",
                desc: "Instant notifications and live updates across all modules for seamless communication.",
                icon: <TrendingUp className="w-8 h-8" />,
                gradient: "from-purple-500 to-purple-600"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* About Section */}
      <section id="about" className="py-32 bg-gradient-to-br from-slate-50 to-blue-50 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12 md:p-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Our Mission
                </span>
              </h2>
              <div className="w-32 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-8 rounded-full"></div>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="text-slate-700 text-lg md:text-xl leading-relaxed text-center mb-8">
                Smart Campus bridges students, faculty, and administrators using cutting-edge technology — 
                making education efficient, data-driven, and student-centered. We provide a professional, 
                enterprise-grade platform that simplifies campus management while maintaining the highest 
                standards of security and usability.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {[
                  { title: 'Innovation', desc: 'Leveraging latest technology for better outcomes', icon: <Zap className="w-6 h-6" /> },
                  { title: 'Excellence', desc: 'Committed to delivering superior solutions', icon: <Star className="w-6 h-6" /> },
                  { title: 'Integrity', desc: 'Transparent and trustworthy platform', icon: <Shield className="w-6 h-6" /> }
                ].map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                      {value.icon}
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h4>
                    <p className="text-sm text-slate-600">{value.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Key Benefits
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-slate-600 text-xl max-w-3xl mx-auto">
              Discover how Smart Campus can revolutionize your educational institution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Increased Efficiency',
                desc: 'Automate routine tasks and streamline workflows to save time and resources.',
                icon: '⚡',
                gradient: 'from-blue-500 to-blue-600',
                features: ['Automated Scheduling', 'Quick Access', 'Time Saving']
              },
              {
                title: 'Better Engagement',
                desc: 'Enhance student and faculty engagement through intuitive interfaces and real-time communication.',
                icon: '📱',
                gradient: 'from-green-500 to-green-600',
                features: ['Real-time Updates', 'Easy Communication', 'User Friendly']
              },
              {
                title: 'Data-Driven Insights',
                desc: 'Make informed decisions with comprehensive analytics and reporting capabilities.',
                icon: '📊',
                gradient: 'from-purple-500 to-purple-600',
                features: ['Analytics Dashboard', 'Detailed Reports', 'Smart Insights']
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6">{benefit.desc}</p>
                <ul className="space-y-2">
                  {benefit.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(255,255,255) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Campus?</h2>
            <div className="w-24 h-1.5 bg-white mx-auto mb-8 rounded-full"></div>
            <p className="text-slate-300 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join leading institutions already experiencing the benefits of modern campus management. 
              Start your journey today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-slate-900 px-12 py-4 rounded-xl text-base font-bold hover:bg-slate-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Get Started Today
              </Link>
              <Link
                to="/register"
                className="bg-transparent text-white px-12 py-4 rounded-xl text-base font-bold border-2 border-white hover:bg-white/10 transition-all shadow-lg hover:shadow-xl"
              >
                Schedule a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Smart Campus
                </h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Empowering educational institutions with modern technology solutions for efficient campus management.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'linkedin'].map((social) => (
                  <div key={social} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer">
                    <span className="text-slate-600 text-sm font-semibold">{social[0].toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Product</h4>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li><a href="#features" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#benefits" className="hover:text-blue-600 transition-colors">Benefits</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Resources</h4>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li><Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-blue-600 transition-colors">Register</Link></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Contact</h4>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@smartcampus.edu
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  123 Campus Avenue<br />Education City, EC 12345
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t-2 border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-600 text-sm font-medium">&copy; 2025 Smart Campus. All Rights Reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">Privacy Policy</a>
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">Terms of Service</a>
                <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
