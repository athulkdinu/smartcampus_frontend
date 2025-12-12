import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import MainLayout from '../../shared/layouts/MainLayout'
import Card from '../../shared/components/Card'
import Button from '../../shared/components/Button'
import FormInput from '../../shared/components/FormInput'
import { Play, FileText, Code, Award, Search, Filter, Video, HelpCircle, CheckCircle2, Lock } from 'lucide-react'
import { getCoursesAPI } from '../../services/skillCourseAPI'

const SkillsPage = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const params = { status: 'Published' }
      if (search) params.search = search
      if (categoryFilter !== 'All') params.category = categoryFilter

      const res = await getCoursesAPI(params)
      if (res?.status === 200) {
        setCourses(res.data.courses || [])
      } else {
        toast.error('Failed to load courses')
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) loadCourses()
    }, 500)
    return () => clearTimeout(timer)
  }, [search, categoryFilter])

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))]

  const getRoundIcons = (rounds) => {
    const icons = []
    if (rounds?.some(r => r.roundNumber === 1)) icons.push({ icon: Video, label: 'Learn' })
    if (rounds?.some(r => r.roundNumber === 2)) icons.push({ icon: HelpCircle, label: 'Quiz' })
    if (rounds?.some(r => r.roundNumber === 3)) icons.push({ icon: Code, label: 'Project' })
    if (rounds?.some(r => r.roundNumber === 4)) icons.push({ icon: Award, label: 'Final' })
    return icons
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-8 md:p-12 border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Skill Development</h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl">
            Learn, practice, build — skill courses with gated rounds. Master new skills through structured learning paths.
          </p>
        </div>

        {/* Search and Filter */}
        <Card>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <FormInput
                placeholder="Search by title, faculty, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Course Grid */}
        {loading ? (
          <Card>
            <div className="text-center py-12 text-slate-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p>Loading courses...</p>
            </div>
          </Card>
        ) : courses.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full flex flex-col cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/student/skills/${course._id}`)}>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{course.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{course.createdBy?.name || 'Faculty'}</p>
                      </div>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                        {course.category}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 mb-4 line-clamp-2">{course.shortDesc}</p>
                    
                    {/* Round Icons */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {getRoundIcons([]).map((item, i) => (
                        <div key={i} className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-xs text-slate-600">
                          <item.icon className="w-3 h-3" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/student/skills/${course._id}`)
                      }}
                    >
                      View Course
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </MainLayout>
  )
}

export default SkillsPage
