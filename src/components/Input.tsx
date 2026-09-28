import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, icon, fullWidth = true, className, ...props }, ref) => (
    <div className={clsx(fullWidth && 'w-full')}>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
        <input
          ref={ref}
          className={clsx(
            'input',
            icon && 'pl-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-sm text-gray-600">{helper}</p>
      ) : null}
    </div>
  )
)

Input.displayName = 'Input'

interface TextAreaProps extends React.TextAreaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  fullWidth?: boolean
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helper, fullWidth = true, className, ...props }, ref) => (
    <div className={clsx(fullWidth && 'w-full')}>
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        className={clsx(
          'input resize-none',
          error && 'input-error',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-sm text-gray-600">{helper}</p>
      ) : null}
    </div>
  )
)

TextArea.displayName = 'TextArea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helper?: string
  options: Array<{ value: string; label: string }>
  fullWidth?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, fullWidth = true, className, ...props }, ref) => (
    <div className={clsx(fullWidth && 'w-full')}>
      {label && <label className="label">{label}</label>}
      <select
        ref={ref}
        className={clsx(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      >
        <option value="">Selecione uma opção</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      ) : helper ? (
        <p className="mt-1 text-sm text-gray-600">{helper}</p>
      ) : null}
    </div>
  )
)

Select.displayName = 'Select'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex items-start gap-2">
      <input
        ref={ref}
        type="checkbox"
        className={clsx(
          'mt-1 w-4 h-4 accent-blue-600 cursor-pointer',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {label && (
        <label className="text-sm text-gray-700 cursor-pointer">
          {label}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </label>
      )}
    </div>
  )
)

Checkbox.displayName = 'Checkbox'
