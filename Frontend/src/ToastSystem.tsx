/* eslint-disable react-refresh/only-export-components */
import { ToastProvider, useToast as useToastCore } from './ToastContext'
import { ToastItem } from './Toast'
import { useEffect } from 'react'

export function ToastContainer() {
  const { toasts, removeToast } = useToastCore()

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  )
}

export function ToastAutoDismiss({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useToastCore()

  useEffect(() => {
    toasts.forEach((toast) => {
      if (toast.duration !== 0) {
        const duration = toast.duration ?? 4000
        const timer = setTimeout(() => {
          removeToast(toast.id)
        }, duration)
        return () => clearTimeout(timer)
      }
    })
  }, [toasts, removeToast])

  return <>{children}</>
}

export function ToastProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ToastAutoDismiss>
        {children}
      </ToastAutoDismiss>
    </ToastProvider>
  )
}

export const useToast = useToastCore
