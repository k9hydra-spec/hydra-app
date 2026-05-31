import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('אימייל או סיסמה שגויים')
      setLoading(false)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F0F4F8' }}>
      <div
        className="w-full bg-white rounded-2xl"
        style={{ maxWidth: 340, padding: 40, border: '0.5px solid #D0D8E0', boxShadow: '0 2px 12px rgba(27,58,92,0.07)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.png"
            alt="HYDRA"
            style={{ width: 110, height: 110, objectFit: 'contain', borderRadius: '50%' }}
            className="mb-4"
          />
          <h1 className="text-xl font-bold" style={{ color: '#1B3A5C' }}>HYDRA</h1>
          <p className="text-xs mt-1 text-center" style={{ color: '#7A8A9A' }}>
            מרכז הידרותרפיה ופיזיותרפיה לבעלי חיים
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B3A5C' }}>אימייל</label>
            <div className="relative">
              <Mail
                size={14}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#AAB8C5', insetInlineEnd: 11 }}
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full rounded-lg text-sm focus:outline-none"
                style={{ border: '0.5px solid #D0D8E0', padding: '10px 34px 10px 12px', color: '#1B3A5C' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#1B3A5C' }}>סיסמה</label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: '#AAB8C5', insetInlineEnd: 11 }}
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg text-sm focus:outline-none"
                style={{ border: '0.5px solid #D0D8E0', padding: '10px 34px 10px 34px', color: '#1B3A5C' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ color: '#AAB8C5', insetInlineStart: 11 }}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="rounded-lg p-3 text-sm text-center"
              style={{ background: '#FEF2F2', border: '0.5px solid #FECACA', color: '#DC2626' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-semibold text-white py-3 rounded-xl transition-all disabled:opacity-60 mt-2"
            style={{ background: '#1B3A5C' }}
            onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#2A6B8A') }}
            onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#1B3A5C') }}
          >
            {loading ? 'מתחבר...' : 'כניסה'}
          </button>
        </form>

        <div className="text-center mt-5">
          <button type="button" className="text-xs" style={{ color: '#7A8A9A' }}>
            שכחתי סיסמה
          </button>
        </div>
      </div>
    </div>
  )
}
