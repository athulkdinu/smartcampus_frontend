import HRLayout from '../../shared/layouts/HRLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import { hrResults } from '../data/hrDemoData'
import { Trophy, Send, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const HRResults = () => {
  const handleNotify = (candidate) => toast.success(`Notification sent to ${candidate}`)
  const markReviewed = (candidate) => toast.success(`${candidate} marked as reviewed`)

  return (
    <HRLayout>
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white p-6 border border-white/10 flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">Results</p>
          <h1 className="text-3xl font-bold">Publish final outcomes</h1>
          <p className="text-slate-300">Selections and rejections here sync to the Student portal → Application Status.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-emerald-100 bg-emerald-50/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600">Selected candidates</p>
                <h2 className="text-xl font-bold text-emerald-900">Offer list</h2>
              </div>
              <Trophy className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-3">
              {hrResults.selected.map(entry => (
                <div key={entry.candidate} className="p-4 rounded-2xl border border-emerald-100 bg-white/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-900">{entry.candidate}</p>
                      <p className="text-xs text-emerald-700">{entry.jobTitle}</p>
                    </div>
                    <span className="text-xs text-emerald-600">{entry.package}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="primary" className="text-white" onClick={() => toast.success('Offer letter generated')}>
                      Offer Letter
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleNotify(entry.candidate)} className="flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      Notify
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border border-rose-100 bg-rose-50/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-rose-600">Rejected candidates</p>
                <h2 className="text-xl font-bold text-rose-900">Feedback queue</h2>
              </div>
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="space-y-3">
              {hrResults.rejected.map(entry => (
                <div key={entry.candidate} className="p-4 rounded-2xl border border-rose-100 bg-white/80 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-rose-900">{entry.candidate}</p>
                    <p className="text-xs text-rose-700">{entry.jobTitle}</p>
                    <p className="text-xs text-rose-500 mt-1">Reason: {entry.reason || 'Not specified'}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => markReviewed(entry.candidate)}>
                    Mark reviewed
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </HRLayout>
  )
}

export default HRResults

