import { useEffect } from 'react'
import './Toast.css'

interface ToastProps {
  message: string | null
  nonce: number
  onDismiss: () => void
  duration?: number
}

function Toast({ message, nonce, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [message, nonce, duration, onDismiss])

  return (
    <div aria-live="polite" className="toast-region" role="status">
      {message && (
        <p className="toast" key={nonce}>
          {message}
        </p>
      )}
    </div>
  )
}

export default Toast
