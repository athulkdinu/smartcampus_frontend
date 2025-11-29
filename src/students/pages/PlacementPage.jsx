import { motion } from 'framer-motion'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Briefcase, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react'

const PlacementPage = () => {
  const activeDrives = [
    { company: 'TCS', position: 'Software Engineer', location: 'Remote', deadline: '5 days', status: 'Open' },
    { company: 'Wipro', position: 'Data Analyst', location: 'Hybrid', deadline: '3 days', status: 'Open' },
    { company: 'UST', position: 'Frontend Developer', location: 'On-site', deadline: '1 week', status: 'Open' }
  ]
  
  const applications = [
    { company: 'TCS', position: 'Software Engineer', status: 'Shortlisted', date: '2 days ago', icon: CheckCircle2, color: 'text-green-600' },
    { company: 'Wipro', position: 'Data Analyst', status: 'Under Review', date: '5 days ago', icon: Clock, color: 'text-blue-600' },
    { company: 'UST', position: 'Frontend Developer', status: 'Rejected', date: '1 week ago', icon: XCircle, color: 'text-red-600' }
  ]
  
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Placement & Internship</h1>
            <p className="text-slate-600">Browse opportunities and track your applications</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <FileText className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
            <Button variant="primary">Browse Jobs</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Drives', value: 12, icon: Briefcase, color: 'from-blue-500 to-blue-600' },
            { label: 'Applications', value: 8, icon: FileText, color: 'from-green-500 to-green-600' },
            { label: 'Shortlisted', value: 3, icon: CheckCircle2, color: 'from-purple-500 to-purple-600' },
            { label: 'Interviews', value: 2, icon: Clock, color: 'from-orange-500 to-orange-600' }
          ].map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Active Drives */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Active Placement Drives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeDrives.map((drive, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{drive.company}</h3>
                    <p className="text-sm text-slate-600">{drive.position}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {drive.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-600">📍 {drive.location}</p>
                  <p className="text-sm text-slate-600">⏰ Deadline: {drive.deadline}</p>
                </div>
                <Button variant="primary" size="sm" className="w-full">Apply Now</Button>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* My Applications */}
        <Card>
          <h2 className="text-xl font-bold text-slate-900 mb-6">My Applications</h2>
          <div className="space-y-4">
            {applications.map((app, idx) => {
              const Icon = app.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{app.company}</h3>
                        <p className="text-sm text-slate-600">{app.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`flex items-center gap-2 text-sm font-semibold ${app.color}`}>
                          <Icon className="w-4 h-4" />
                          {app.status}
                        </div>
                        <p className="text-xs text-slate-400">{app.date}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </Card>
      </motion.div>
    </MainLayout>
  )
}

export default PlacementPage

