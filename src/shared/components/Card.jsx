import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const Card = forwardRef(({ 
  children, 
  className = '', 
  hover = true,
  onClick,
  padding = 'p-6',
  ...props 
}, ref) => {
  const baseStyles = 'bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-200'
  
  const hoverStyles = hover ? 'hover:shadow-lg hover:border-slate-200' : ''
  const clickableStyles = onClick ? 'cursor-pointer' : ''
  
  return (
    <motion.div
      ref={ref}
      whileHover={hover && onClick ? { y: -2 } : {}}
      className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${padding} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  )
})

Card.displayName = 'Card'

export default Card

