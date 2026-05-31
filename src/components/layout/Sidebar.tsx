import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarDays, PawPrint, PlusCircle, Settings } from 'lucide-react'

const navItems = [
  { key: 'daily', icon: CalendarDays, to: '/' },
  { key: 'clients', icon: PawPrint, to: '/clients' },
  { key: 'newClient', icon: PlusCircle, to: '/clients/new' },
  { key: 'settings', icon: Settings, to: '/settings' },
] as const

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="flex flex-col flex-1 bg-white">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-center" style={{ borderBottom: '0.5px solid #D0D8E0' }}>
        <img src="/logo.png" alt="HYDRA" style={{ height: 80, width: 'auto', objectFit: 'contain' }} />
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-6" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ key, icon: Icon, to }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 rounded-xl text-sm font-medium transition-colors"
            style={({ isActive }) =>
              isActive
                ? { background: '#1B3A5C', color: '#FFFFFF', padding: '11px 14px', textDecoration: 'none' }
                : { color: '#7A8A9A', padding: '11px 14px', textDecoration: 'none' }
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} color={isActive ? '#FFFFFF' : '#AAB8C5'} />
                <span>{t(`nav.${key}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
