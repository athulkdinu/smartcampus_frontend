import { useState } from 'react'
import toast from 'react-hot-toast'
import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { candidateProfiles as seedProfiles } from '../data/hrDemoData'
import { Users, ThumbsUp, ThumbsDown } from 'lucide-react'

const HRCandidates = () => {
  const [profiles, setProfiles] = useState(seedProfiles)

  const updateStatus = (student, status) => {
    setProfiles(prev =>
      prev.map(profile =>
        profile.student === student ? { ...profile, status } : profile
      )
    )
    toast.success(`${student} marked as ${status}`)
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Candidate review</p>
            <h1 className="text-3xl font-bold text-slate-900">Evaluate shortlisted talent</h1>
            <p className="text-slate-600">See achievements, highlight risks, and record approvals.</p>
          </div>
          <Button variant="primary">
            <Users className="w-4 h-4 mr-2" />
            Share summary
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {profiles.map(profile => (
            <Card key={profile.student} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{profile.branch}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{profile.student}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  profile.status === 'Shortlisted'
                    ? 'bg-emerald-50 text-emerald-700'
                    : profile.status === 'Interview'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-amber-50 text-amber-700'
                }`}>
                  {profile.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{profile.experience}</p>
              <ul className="text-sm text-slate-600 list-disc list-inside space-y-1 mb-4">
                {profile.highlights.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateStatus(profile.student, 'Shortlisted')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => updateStatus(profile.student, 'Review')}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Rework
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </HRLayout>
  )
}

export default HRCandidates

