const LoadingSkeleton = ({ type = 'text', className = '' }) => {
  const baseStyles = 'animate-pulse bg-slate-200 rounded'
  
  const types = {
    text: 'h-4',
    heading: 'h-8',
    card: 'h-48',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24',
    table: 'h-12'
  }
  
  return (
    <div className={`${baseStyles} ${types[type]} ${className}`}></div>
  )
}

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
    <LoadingSkeleton type="heading" className="w-3/4" />
    <LoadingSkeleton type="text" className="w-full" />
    <LoadingSkeleton type="text" className="w-5/6" />
    <LoadingSkeleton type="text" className="w-4/6" />
  </div>
)

export const TableSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
    <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
      <LoadingSkeleton type="heading" className="w-1/4" />
    </div>
    <div className="divide-y divide-slate-200">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="px-6 py-4 flex gap-4">
          <LoadingSkeleton type="text" className="flex-1" />
          <LoadingSkeleton type="text" className="flex-1" />
          <LoadingSkeleton type="text" className="flex-1" />
        </div>
      ))}
    </div>
  </div>
)

export default LoadingSkeleton

