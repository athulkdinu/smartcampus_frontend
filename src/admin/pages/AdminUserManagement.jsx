import { useState, useMemo, useEffect, Fragment } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import AdminLayout from '../../shared/layouts/AdminLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import Modal from '../../shared/components/Modal'
import { Users, Plus, Search } from 'lucide-react'
import { createUserByAdminAPI } from '../../services/allAPI'
import { getAllUsersAPI } from '../../services/api'

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  })

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'hr', label: 'HR' }
  ]

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await getAllUsersAPI()
      if (response?.status === 200) {
        setAccounts(response.data.users || [])
      } else {
        toast.error('Failed to load users')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to load users'
      toast.error(message)
    } finally {
      setLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        await fetchUsers()
        toast.success('Account created successfully')
        setShowCreateModal(false)
        setNewUser({ name: '', email: '', password: '', role: 'student' })
      } else {
        const message = response?.response?.data?.message || 'Failed to create account'
        toast.error(message)
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Something went wrong'
      toast.error(message)
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
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers && (
                  <tr>
                    <td colSpan={3} className="py-4 px-4 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                )}
                {!loadingUsers && filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 px-4 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-10 h-10 text-slate-300" />
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                )}
                {!loadingUsers &&
                  filteredAccounts.map((account, idx) => (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">{account.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{account.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 capitalize">
                          {account.role}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
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
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">Create Account</Button>
              <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      </Fragment>
    </AdminLayout>
  )
}

export default AdminUserManagement

