import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <img src="/logo.png" alt="HYDRA" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 opacity-80" />
          <p className="text-slate-400 text-sm">טוען...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}
