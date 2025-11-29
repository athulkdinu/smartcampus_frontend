import { useMemo } from 'react'
import { motion } from 'framer-motion'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import { Briefcase, FileText, Calendar, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { hrJobOpenings, hrApplications, hrPipelineSummary, hrActivities } from '../data/hrDemoData'

const HRDashboard = () => {
  const stats = useMemo(() => {
    return {
      activeJobs: hrJobOpenings.filter(job => job.status !== 'Draft').length,
      totalApplications: hrApplications.length,
      interviewsScheduled: hrPipelineSummary.interviewed,
      offersReleased: hrPipelineSummary.offered
    }
  }, [])
  const pipelineChartData = [
    { stage: 'Pending', value: hrPipelineSummary.pending },
    { stage: 'Shortlisted', value: hrPipelineSummary.shortlisted },
    { stage: 'Interviewed', value: hrPipelineSummary.interviewed },
    { stage: 'Offered', value: hrPipelineSummary.offered },
    { stage: 'Rejected', value: hrPipelineSummary.rejected }
  ]
  const applicationsByJob = hrJobOpenings.map(job => ({ job: job.title, applications: job.applications }))
  const statCards = [
    {
      label: 'Active Job Postings',
      value: stats.activeJobs,
      icon: Briefcase,
      accent: 'from-sky-500 to-blue-500'
    },
    {
      label: 'Total Applications',
      value: stats.totalApplications,
      icon: FileText,
      accent: 'from-fuchsia-500 to-pink-500'
    },
    {
      label: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: Calendar,
      accent: 'from-indigo-500 to-purple-500'
    },
    {
      label: 'Offers Released',
      value: stats.offersReleased,
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
            {/* <div className="px-5 py-2 rounded-2xl bg-white/10 border border-white/30 text-sm">Pipeline synced · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div> */}
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
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_70%)]" />
                  <div className="relative flex flex-col gap-2">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.accent} flex items-center justify-center shadow-lg shadow-slate-900/40`}>
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                    <p className="text-xs uppercase tracking-wide text-black">{stat.label}</p>
                    <p className="text-3xl font-bold text-black">{stat.value}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Pipeline Tracker</p>
                  <h2 className="text-2xl font-bold text-slate-900">Applications Journey</h2>
                </div>
                <span className="text-sm text-slate-500">Pending → Offered</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pipelineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border border-slate-100/10 bg-white/85 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Applications by Job</p>
                  <h2 className="text-xl font-bold text-slate-900">Where students are applying</h2>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={applicationsByJob}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="job" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', color: 'white', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="applications" fill="#f472b6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-100 bg-white/85 backdrop-blur">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Activity Feed</h2>
              <div className="space-y-3">
                {hrActivities.map((activity) => (
                  <div key={activity.title} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/80">
                    <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </HRLayout>
  )
}

export default HRDashboard
