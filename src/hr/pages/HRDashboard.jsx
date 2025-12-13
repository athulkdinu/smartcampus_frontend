import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import { Briefcase, FileText, Calendar, Users } from 'lucide-react'
import { getHRDashboardAPI } from '../../services/placementAPI'
import toast from 'react-hot-toast'

const HRDashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    offersReleased: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const res = await getHRDashboardAPI()
      if (res?.status === 200) {
        setStats({
          activeJobs: res.data.activeJobs || 0,
          totalApplications: res.data.totalApplications || 0,
          interviewsScheduled: res.data.interviewsScheduled || 0,
          offersReleased: res.data.offersReleased || 0
        })
      } else {
        toast.error('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      label: 'Active Job Postings',
      value: loading ? '...' : stats.activeJobs,
      icon: Briefcase,
      accent: 'from-sky-900 to-blue-500'
    },
    {
      label: 'Total Applications',
      value: loading ? '...' : stats.totalApplications,
      icon: FileText,
      accent: 'from-fuchsia-900 to-pink-500'
    },
    {
      label: 'Interviews Scheduled',
      value: loading ? '...' : stats.interviewsScheduled,
      icon: Calendar,
      accent: 'from-indigo-500 to-purple-500'
    },
    {
      label: 'Offers Released',
      value: loading ? '...' : stats.offersReleased,
      icon: Users,
      accent: 'from-emerald-500 to-green-500'
    }
  ]

  return (
    <HRLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-8 border border-white/10 shadow-[0_15px_50px_rgba(2,6,23,0.7)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Placement Control Room</p>
              <h1 className="text-3xl font-bold">HR Workflow Dashboard</h1>
              <p className="text-slate-300 mt-2">Every action here reflects inside the Student Placement portal instantly.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="relative overflow-hidden bg-slate-900 text-white border border-white/10">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.15),_transparent_70%)]" />
                  <div className="relative flex flex-col gap-3 p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.accent} flex items-center justify-center shadow-lg shadow-slate-900/40`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-xs uppercase tracking-wide text-slate-300 font-semibold">{stat.label}</p>
                    <p className="text-4xl  font-bold text-black">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </HRLayout>
  )
}

export default HRDashboard
