import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import Modal from '../../shared/components/Modal'
import { Users, Plus, Search, Edit, Trash2, CheckCircle2, XCircle, Key } from 'lucide-react'
import { userAccounts, roleOptions, branchOptions } from '../data/adminDemoData'
import { createUserByAdminAPI } from '../../services/allAPI'

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [accounts, setAccounts] = useState(userAccounts)
  const [editingUser, setEditingUser] = useState(null)

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    branch: 'CSE',
    year: '',
    department: '',
    subject: '',
    company: ''
  })

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === 'all' || account.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [accounts, searchTerm, roleFilter])

  const handleCreateUser = async (e) => {
    e.preventDefault()

    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.role) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const payload = {
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password.trim(),
        role: newUser.role
      }

      const response = await createUserByAdminAPI(payload)

      if (response?.status === 201) {
        const created = response.data.user

        const account = {
          id: created.id,
          name: created.name,
          email: created.email,
          role: created.role,
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: 'Never',
          ...(newUser.role === 'student' && { branch: newUser.branch, year: newUser.year }),
          ...(newUser.role === 'faculty' && { department: newUser.department, subject: newUser.subject }),
          ...(newUser.role === 'hr' && { company: newUser.company })
        }

        setAccounts(prev => [...prev, account])
        toast.success('Account created successfully')
        setShowCreateModal(false)
        setNewUser({ name: '', email: '', password: '', role: 'student', branch: 'CSE', year: '', department: '', subject: '', company: '' })
      } else {
        const message = response?.response?.data?.message || 'Failed to create account'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
    }
  }

  const openEditModal = (account) => {
    setEditingUser({
      ...account,
      branch: account.branch || 'CSE',
      year: account.year || '',
      department: account.department || '',
      subject: account.subject || '',
      company: account.company || ''
    })
    setShowEditModal(true)
  }

  const handleUpdateUser = (e) => {
    e.preventDefault()
    if (!editingUser) return
    setAccounts(prev => prev.map(acc => acc.id === editingUser.id ? editingUser : acc))
    toast.success('Account updated')
    setShowEditModal(false)
  }

  const handleToggleStatus = (id) => {
    setAccounts(accounts.map(acc => 
      acc.id === id ? { ...acc, status: acc.status === 'Active' ? 'Inactive' : 'Active' } : acc
    ))
    toast.success('Status updated')
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(acc => acc.id !== id))
      toast.success('Account deleted')
    }
  }

  const handleResetPassword = (id) => {
    const account = accounts.find(acc => acc.id === id)
    if (account) {
      const defaultPassword = `${account.role}123`
      toast.success(`Password reset for ${account.name}\nNew password: ${defaultPassword}`, { duration: 5000 })
    }
  }

  return (
    <AdminLayout>
      <Fragment>
        <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-6 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">User Registry</p>
              <h1 className="text-3xl font-bold">Campus Identity Directory</h1>
              <p className="text-slate-300 mt-1">Every account surfaced here is available to the student and faculty portals.</p>
            </div>
            <Button variant="primary" onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-sky-500 to-blue-500 border-none">
              <Plus className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </div>
        </div>

        <Card>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Roles</option>
                {roleOptions.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Details</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account, idx) => (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-3 px-4 text-sm font-medium text-slate-900">{account.id}</td>
                    <td className="py-3 px-4 text-sm text-slate-900">{account.name}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{account.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                        {account.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {account.role === 'student' && `${account.branch} • ${account.year}`}
                      {account.role === 'faculty' && `${account.department} • ${account.subject}`}
                      {account.role === 'hr' && account.company}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        account.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(account)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-indigo-500" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(account.id)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(account.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          title={account.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {account.status === 'Active' ? (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredAccounts.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No accounts found</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Account" size="lg">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="John Doe" required />
              <FormInput label="Email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@example.com" required />
              <FormInput label="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="Enter password" required />
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {roleOptions.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
              {newUser.role === 'student' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Branch</label>
                    <select value={newUser.branch} onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      {branchOptions.map(branch => (
                        <option key={branch.value} value={branch.value}>{branch.label}</option>
                      ))}
                    </select>
                  </div>
                  <FormInput label="Year" value={newUser.year} onChange={(e) => setNewUser({ ...newUser, year: e.target.value })} placeholder="1st Year" />
                </>
              )}
              {newUser.role === 'faculty' && (
                <>
                  <FormInput label="Department" value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} placeholder="Computer Science" />
                  <FormInput label="Subject" value={newUser.subject} onChange={(e) => setNewUser({ ...newUser, subject: e.target.value })} placeholder="Data Structures" />
                </>
              )}
              {newUser.role === 'hr' && (
                <FormInput label="Company Name" value={newUser.company} onChange={(e) => setNewUser({ ...newUser, company: e.target.value })} placeholder="Company Name" required />
              )}
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">Create Account</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Account" size="lg">
          {editingUser && (
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Full Name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} required />
                <FormInput label="Email" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
                {editingUser.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Branch</label>
                      <select value={editingUser.branch} onChange={(e) => setEditingUser({ ...editingUser, branch: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        {branchOptions.map(branch => (
                          <option key={branch.value} value={branch.value}>{branch.label}</option>
                        ))}
                      </select>
                    </div>
                    <FormInput label="Year" value={editingUser.year} onChange={(e) => setEditingUser({ ...editingUser, year: e.target.value })} />
                  </>
                )}
                {editingUser.role === 'faculty' && (
                  <>
                    <FormInput label="Department" value={editingUser.department} onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })} />
                    <FormInput label="Subject" value={editingUser.subject} onChange={(e) => setEditingUser({ ...editingUser, subject: e.target.value })} />
                  </>
                )}
                {editingUser.role === 'hr' && (
                  <FormInput label="Company Name" value={editingUser.company} onChange={(e) => setEditingUser({ ...editingUser, company: e.target.value })} />
                )}
              </div>
              <div className="flex gap-3">
                <Button type="submit" variant="primary">Save Changes</Button>
                <Button type="button" variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </Modal>
      </Fragment>
    </AdminLayout>
  )
}

export default AdminUserManagement

