import React from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdrop?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className={clsx(
          'bg-white rounded-lg shadow-card-lg w-full animate-slide-up',
          sizeClasses[size]
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex gap-3 p-6 border-t border-gray-200 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  onClose?: () => void
}

export const Alert = ({ type, title, message, onClose }: AlertProps) => {
  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }

  const titleColors = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  }

  return (
    <div className={clsx('border rounded-lg p-4 mb-4', colors[type])}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className={clsx('font-semibold mb-1', titleColors[type])}>{title}</h4>
          <p className={clsx('text-sm', textColors[type])}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx('ml-4 font-bold', textColors[type])}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
