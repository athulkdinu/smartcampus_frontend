import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import { BarChart3, TrendingUp, Target } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

const performanceTrend = [
  { week: 'W1', attendance: 91, completion: 82 },
  { week: 'W2', attendance: 92, completion: 84 },
  { week: 'W3', attendance: 94, completion: 88 },
  { week: 'W4', attendance: 90, completion: 86 }
]

const FacultyAnalytics = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Analytics</p>
            <h1 className="text-3xl font-bold text-slate-900">Pulse of every cohort</h1>
            <p className="text-slate-600">Monitor attendance, grading velocity, and engagement in one place.</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-blue-50 text-blue-700 text-sm font-semibold">
            {selectedFaculty.subject.name} · {selectedFaculty.stats.sections} sections
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Engagement trend</h2>
                <p className="text-sm text-slate-500">Rolling 4-week comparison of attendance vs completion.</p>
              </div>
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px'
                  }}
                />
                <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={3} dot />
                <Line type="monotone" dataKey="completion" stroke="#22c55e" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {[{
            title: 'Attendance health',
            value: `${selectedFaculty.stats.attendance}%`,
            desc: 'Across all sessions this week',
            icon: TrendingUp,
            color: 'text-emerald-600'
          }, {
            title: 'Grading velocity',
            value: `${100 - selectedFaculty.stats.pendingGrading}%`,
            desc: 'Of submissions cleared',
            icon: Target,
            color: 'text-blue-600'
          }].map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              </Card>
            )
          })}
        </div>
      </div>
    </FacultyLayout>
  )
}

export default FacultyAnalytics

