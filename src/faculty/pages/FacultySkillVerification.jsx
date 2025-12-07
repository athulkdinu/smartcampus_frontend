import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import FacultyLayout from '../../shared/layouts/FacultyLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import Modal from '../../shared/components/Modal'
import FormInput from '../../shared/components/FormInput'
import { CheckCircle2, XCircle, Clock, User, FileText, ExternalLink, Filter } from 'lucide-react'
import { getSkillsForFacultyAPI, approveSkillAPI, rejectSkillAPI } from '../../services/skillAPI'
import SERVERURL from '../../services/serverURL'

const FacultySkillVerification = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // 'pending', 'approved', 'rejected', 'all'
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [rejectRemarks, setRejectRemarks] = useState('')
  const [processing, setProcessing] = useState(null)

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      setLoading(true)
      const res = await getSkillsForFacultyAPI()
      if (res?.status === 200) {
        setSkills(res.data.skills || [])
      } else {
        toast.error('Failed to load skills')
      }
    } catch (error) {
      console.error('Error loading skills:', error)
      toast.error('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (skillId) => {
    try {
      setProcessing(skillId)
      const res = await approveSkillAPI(skillId)
      if (res?.status === 200) {
        toast.success('Skill approved successfully')
        await loadSkills()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to approve skill')
      }
    } catch (error) {
      console.error('Error approving skill:', error)
      toast.error(error?.response?.data?.message || 'Failed to approve skill')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async () => {
    if (!rejectRemarks.trim()) {
      toast.error('Please provide remarks for rejection')
      return
    }

    try {
      setProcessing(selectedSkill._id)
      const res = await rejectSkillAPI(selectedSkill._id, rejectRemarks)
      if (res?.status === 200) {
        toast.success('Skill rejected')
        setShowRejectModal(false)
        setSelectedSkill(null)
        setRejectRemarks('')
        await loadSkills()
      } else {
        toast.error(res?.response?.data?.message || 'Failed to reject skill')
      }
    } catch (error) {
      console.error('Error rejecting skill:', error)
      toast.error(error?.response?.data?.message || 'Failed to reject skill')
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
    }
  }

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(skill => skill.status === filter)

  const pendingCount = skills.filter(s => s.status === 'pending').length
  const approvedCount = skills.filter(s => s.status === 'approved').length
  const rejectedCount = skills.filter(s => s.status === 'rejected').length

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Skill Verification</h1>
          <p className="text-slate-600">Review and verify student skill submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400 opacity-50" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-400 opacity-50" />
            </div>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </Card>

        {/* Skills List */}
        {loading ? (
          <Card>
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50 animate-pulse" />
              <p>Loading skills...</p>
            </div>
          </Card>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{skill.title}</h3>
                      {getStatusBadge(skill.status)}
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        <span className="font-medium">Student:</span> {skill.student?.name || 'Unknown'} ({skill.student?.studentID || 'N/A'})
                      </span>
                    </div>
                    {skill.provider && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Provider:</span> {skill.provider}
                      </div>
                    )}
                    <div className="text-xs text-slate-500">
                      Submitted: {new Date(skill.createdAt).toLocaleString()}
                    </div>
                    {skill.status === 'rejected' && skill.remarks && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs font-medium text-red-700 mb-1">Rejection Remarks:</p>
                        <p className="text-xs text-red-600">{skill.remarks}</p>
                      </div>
                    )}
                    {skill.status === 'approved' && skill.approvedBy && (
                      <div className="text-xs text-slate-500">
                        Approved by: {skill.approvedBy?.name || 'You'} on {new Date(skill.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {skill.certificateUrl && (
                    <div className="mb-4">
                      <a
                        href={skill.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Certificate
                      </a>
                    </div>
                  )}

                  {skill.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t border-slate-200 mt-auto">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(skill._id)}
                        loading={processing === skill._id}
                        className="flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedSkill(skill)
                          setShowRejectModal(true)
                        }}
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No skills found</h3>
              <p className="text-slate-500">
                {filter === 'pending' 
                  ? 'No pending skill submissions at the moment'
                  : `No ${filter} skills found`}
              </p>
            </div>
          </Card>
        )}

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => {
            setShowRejectModal(false)
            setSelectedSkill(null)
            setRejectRemarks('')
          }}
          title="Reject Skill Submission"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-medium">Skill:</span> {selectedSkill?.title}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Student:</span> {selectedSkill?.student?.name || 'Unknown'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Remarks <span className="text-red-600">*</span>
              </label>
              <textarea
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                required
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowRejectModal(false)
                  setSelectedSkill(null)
                  setRejectRemarks('')
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReject}
                loading={processing === selectedSkill?._id}
                disabled={!rejectRemarks.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Skill
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </FacultyLayout>
  )
}

export default FacultySkillVerification

