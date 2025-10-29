type StatusType = 'success' | 'error' | 'info' | null

interface StatusMessageProps {
  message: string
  type: StatusType
}

const statusClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

export function StatusMessage({ message, type }: StatusMessageProps) {
  if (!message || !type) return null

  return (
    <div className={`p-3.5 rounded-lg mb-5 text-sm border ${statusClasses[type]} animate-in slide-in-from-top-2`}>
      {message}
    </div>
  )
}
