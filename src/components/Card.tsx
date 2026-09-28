import React from 'react'
import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, onClick, hover = false }, ref) => (
    <div
      ref={ref}
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg shadow-card p-6',
        hover && 'hover:shadow-card-lg transition-shadow cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
)

Card.displayName = 'Card'

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

export const CardHeader = ({ title, subtitle, action, className }: CardHeaderProps) => (
  <div className={clsx('flex items-start justify-between mb-4 pb-4 border-b border-gray-200', className)}>
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="ml-4">{action}</div>}
  </div>
)

interface CardBodyProps {
  children: React.ReactNode
  className?: string
}

export const CardBody = ({ children, className }: CardBodyProps) => (
  <div className={clsx('py-4', className)}>{children}</div>
)

interface CardFooterProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

export const CardFooter = ({ children, className, align = 'between' }: CardFooterProps) => {
  const alignClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={clsx('flex gap-3 pt-4 border-t border-gray-200', alignClass[align], className)}>
      {children}
    </div>
  )
}
