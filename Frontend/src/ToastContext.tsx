/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Toast, type ToastContextType } from './ToastTypes'

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((current) => [...current, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'success', duration })
  }, [addToast])

  const error = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'error', duration })
  }, [addToast])

  const warning = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'warning', duration })
  }, [addToast])

  const info = useCallback((message: string, duration?: number) => {
    addToast({ message, type: 'info', duration })
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
