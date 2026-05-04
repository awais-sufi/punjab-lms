import { X } from 'lucide-react'
import { type Toast, type ToastType } from './ToastTypes'

interface ToastItemProps {
  toast: Toast
  onClose: (id: string) => void
}

export function ToastItem({ toast, onClose }: ToastItemProps) {
  const { type = 'default', message } = toast

  const typeStyles: Record<ToastType, string> = {
    default: 'bg-slate-800 text-white border-slate-600',
    success: 'bg-green-600 text-white border-green-500',
    error: 'bg-red-600 text-white border-red-500',
    warning: 'bg-amber-500 text-white border-amber-400',
    info: 'bg-blue-600 text-white border-blue-500'
  }

  const iconColors: Record<ToastType, string> = {
    default: 'text-white',
    success: 'text-green-200',
    error: 'text-red-200',
    warning: 'text-amber-200',
    info: 'text-blue-200'
  }

  return (
    <div
      className={`toast-item ${typeStyles[type]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="toast-content">
        <p className="toast-message">{message}</p>
      </div>
      <button
        type="button"
        className={`toast-close ${iconColors[type]}`}
        onClick={() => onClose(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  )
}
