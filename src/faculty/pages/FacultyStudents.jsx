import { useMemo } from 'react'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { Users, Search, AlertCircle } from 'lucide-react'
import { getActiveFacultyProfile } from '../utils/getActiveFaculty'

const rosterHighlights = [
  { name: 'Aditi ', section: 'CSE-2A', performance: 'Top 5%', focus: 'Algorithms', status: 'star' },
  { name: 'Rahul Iyer', section: 'CSE-2B', performance: 'Needs support', focus: 'Assignments', status: 'support' },
  { name: 'Tanvi Patel', section: 'ECE-3A', performance: 'Excellent', focus: 'Labs', status: 'star' }
]

const FacultyStudents = () => {
  const selectedFaculty = useMemo(() => getActiveFacultyProfile(), [])

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Student Roster</p>
            <h1 className="text-3xl font-bold text-slate-900">Know every learner you coach</h1>
            <p className="text-slate-600">Context on strengths, risk alerts, and interventions per section.</p>
          </div>
          <Button variant="primary">
            <Users className="w-4 h-4 mr-2" />
            Export roster
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Sections handled</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-500">
                  <Search className="w-4 h-4" />
                  Search students
                </div>
              </div>
            </div>
            {selectedFaculty && selectedFaculty.sections?.length > 0 ? (
              <div className="space-y-4">
                {selectedFaculty.sections.map(section => (
                  <div key={section.name} className="p-5 rounded-2xl border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{section.name}</p>
                        <h3 className="text-lg font-semibold text-slate-900">{section.students} students</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                        {section.attendance}% attendance
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{section.focus}</p>
                    <div className="text-xs text-slate-500">{section.schedule} · {section.room}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-sm">
                No roster data available yet.
              </div>
            )}
          </Card>

          <div className="space-y-4">
            <Card>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Highlights</h2>
              <div className="space-y-3">
                {rosterHighlights.map(student => (
                  <div
                    key={student.name}
                    className="p-4 rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-slate-900">{student.name}</p>
                      {student.status === 'star' ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Top</span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Focus</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{student.section}</p>
                    <p className="text-sm text-slate-600 mt-2">{student.performance} · {student.focus}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Escalations</p>
                  <p className="text-sm text-slate-600">2 students marked for attendance support this week.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </FacultyLayout>
  )
}

export default FacultyStudents

