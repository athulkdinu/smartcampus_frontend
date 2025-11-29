import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const FormInput = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  className = '', 
  placeholder,
  required = false,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border ${
            error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'
          } focus:ring-2 focus:ring-offset-0 focus:outline-none transition-all duration-200 text-slate-900 placeholder:text-slate-400`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>•</span>
          {error}
        </p>
      )}
    </div>
  )
})

FormInput.displayName = 'FormInput'

export default FormInput

