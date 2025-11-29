import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'

const AcademicPageLayout = ({ title, subtitle, actions, children }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/student/academic')}
              className="inline-flex items-center space-x-2 px-3 py-2 rounded-md border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to hub</span>
            </button>
            {actions}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Smart campus</p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{title}</h1>
            {subtitle && <p className="text-slate-500 mt-2 max-w-2xl">{subtitle}</p>}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {children}
      </main>
    </div>
  )
}

export default AcademicPageLayout

