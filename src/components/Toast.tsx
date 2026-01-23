import { useState, useEffect } from 'react'
import { Check, X, AlertCircle, Info } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface ToastProps {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

export default function Toast({ toasts, onRemove }: ToastProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '40px',
      right: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 9999
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast, onRemove])

  const icons = {
    success: <Check size={16} />,
    error: <X size={16} />,
    warning: <AlertCircle size={16} />,
    info: <Info size={16} />
  }

  const colors = {
    success: { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', icon: '#22c55e' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', icon: '#ef4444' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', icon: '#f59e0b' },
    info: { bg: 'rgba(255, 0, 255, 0.15)', border: '#FF00FF', icon: '#FF00FF' }
  }

  const style = colors[toast.type]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: '#1a1a1a',
      border: `1px solid ${style.border}`,
      borderRadius: '8px',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
      minWidth: '280px',
      maxWidth: '400px',
      animation: isLeaving ? 'slideOut 0.3s ease-out forwards' : 'slideIn 0.3s ease-out',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: style.bg,
        color: style.icon,
        flexShrink: 0
      }}>
        {icons[toast.type]}
      </div>
      <span style={{
        flex: 1,
        color: '#cccccc',
        fontSize: '13px',
        lineHeight: 1.4
      }}>
        {toast.message}
      </span>
      <button
        onClick={() => {
          setIsLeaving(true)
          setTimeout(() => onRemove(toast.id), 300)
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#666',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '4px',
          transition: 'all 0.15s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ccc'
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#666'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
