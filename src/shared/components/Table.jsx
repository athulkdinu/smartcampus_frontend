import { motion } from 'framer-motion'

const Table = ({ headers, data, onRowClick, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-200 ${className}`}>
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {data.map((row, rowIdx) => (
            <motion.tr
              key={rowIdx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIdx * 0.05 }}
              onClick={() => onRowClick && onRowClick(row)}
              className={`hover:bg-slate-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {cell}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table

