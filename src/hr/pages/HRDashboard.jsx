import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import { Briefcase, FileText, Calendar, Users, CheckCircle2, Clock, TrendingUp } from 'lucide-react'
import { 
  getHRDashboardAPI, 
  fetchJobsAPI, 
  fetchAllApplicationsForHrAPI, 
  fetchHrInterviewsAPI, 
  fetchHrOffersAPI 
} from '../../services/placementAPI'
import toast from 'react-hot-toast'

const HRDashboard = () => {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCount: 0,
    interviewsScheduled: 0,
    offersReleased: 0
  })
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)

  useEffect(() => {
    loadDashboardData()
    loadActivities()
    
    // Refresh data when page regains focus (e.g., navigating back from other pages)
    const handleFocus = () => {
      loadDashboardData()
      loadActivities()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const res = await getHRDashboardAPI()
      if (res?.status === 200) {
        // Also fetch applications to calculate shortlisted count
        const appsRes = await fetchAllApplicationsForHrAPI()
        const shortlistedCount = appsRes?.status === 200 
          ? (appsRes.data.applications || []).filter(app => app.status === 'Shortlisted').length
          : 0

        setStats({
          activeJobs: res.data.activeJobs || 0,
          totalApplications: res.data.totalApplications || 0,
          shortlistedCount: shortlistedCount,
          interviewsScheduled: res.data.interviewsScheduled || 0,
          offersReleased: res.data.offersReleased || 0
        })
      } else {
        toast.error('Failed to load dashboard data')
        setStats({
          activeJobs: 0,
          totalApplications: 0,
          shortlistedCount: 0,
          interviewsScheduled: 0,
          offersReleased: 0
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
      setStats({
        activeJobs: 0,
        totalApplications: 0,
        shortlistedCount: 0,
        interviewsScheduled: 0,
        offersReleased: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const loadActivities = async () => {
    try {
      setLoadingActivities(true)
      const [jobsRes, appsRes, interviewsRes, offersRes] = await Promise.all([
        fetchJobsAPI({ mine: true }),
        fetchAllApplicationsForHrAPI(),
        fetchHrInterviewsAPI(),
        fetchHrOffersAPI()
      ])

      const activityList = []

      // Recent jobs (last 5, most recent first)
      if (jobsRes?.status === 200) {
        const recentJobs = (jobsRes.data.jobs || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        
        recentJobs.forEach(job => {
          activityList.push({
            type: 'job',
            message: `Job created: ${job.title}`,
            timestamp: job.createdAt,
            jobTitle: job.title,
            icon: Briefcase
          })
        })
      }

      // Recent applications (last 5)
      if (appsRes?.status === 200) {
        const recentApps = (appsRes.data.applications || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
        
        recentApps.forEach(app => {
          activityList.push({
            type: 'application',
            message: `New application from ${app.student?.name || 'Student'} for ${app.job?.title || 'Job'}`,
            timestamp: app.createdAt,
            jobTitle: app.job?.title,
            icon: FileText
          })
        })
      }

      // Recent interviews
      if (interviewsRes?.status === 200) {
        const recentInterviews = (interviewsRes.data.interviews || [])
          .sort((a, b) => new Date(b.createdAt || b.scheduledAt) - new Date(a.createdAt || a.scheduledAt))
          .slice(0, 2)
        
        recentInterviews.forEach(interview => {
          activityList.push({
            type: 'interview',
            message: `Interview scheduled for ${interview.job?.title || 'Job'}`,
            timestamp: interview.createdAt || interview.scheduledAt,
            jobTitle: interview.job?.title,
            icon: Calendar
          })
        })
      }

      // Recent offers
      if (offersRes?.status === 200) {
        const recentOffers = (offersRes.data.offers || [])
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2)
        
        recentOffers.forEach(offer => {
          activityList.push({
            type: 'offer',
            message: `Offer sent for ${offer.job?.title || 'Job'}`,
            timestamp: offer.createdAt,
            jobTitle: offer.job?.title,
            icon: CheckCircle2
          })
        })
      }

      // Sort all activities by timestamp (most recent first) and limit to 10
      activityList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setActivities(activityList.slice(0, 10))
    } catch (error) {
      console.error('Error loading activities:', error)
      setActivities([])
    } finally {
      setLoadingActivities(false)
    }
  }

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently'
    const now = new Date()
    const past = new Date(timestamp)
    const diffMs = now - past
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
    } else {
      return new Date(timestamp).toLocaleDateString()
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
      label: 'Shortlisted',
      value: loading ? '...' : stats.shortlistedCount,
      icon: CheckCircle2,
      accent: 'from-indigo-500 to-purple-500'
    },
    {
      label: 'Interviews Scheduled',
      value: loading ? '...' : stats.interviewsScheduled,
      icon: Calendar,
      accent: 'from-amber-500 to-orange-500'
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
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
                    <p className="text-4xl font-bold text-white">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Activity Feed */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
              <p className="text-sm text-slate-600">Latest actions in your placement workflow</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          
          {loadingActivities ? (
            <div className="flex justify-center items-center py-8">
              <Clock className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No recent activity. Create a job or review applications to see activity here.
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity, idx) => {
                const Icon = activity.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.type === 'job' ? 'from-blue-500 to-blue-600' : activity.type === 'application' ? 'from-purple-500 to-purple-600' : activity.type === 'interview' ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-green-500'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </HRLayout>
  )
}

export default HRDashboard
