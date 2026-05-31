import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CalendarDays, PawPrint, PlusCircle, Settings } from 'lucide-react'

const navItems = [
  { key: 'daily', icon: CalendarDays, to: '/' },
  { key: 'clients', icon: PawPrint, to: '/clients' },
  { key: 'newClient', icon: PlusCircle, to: '/clients/new' },
  { key: 'settings', icon: Settings, to: '/settings' },
] as const

export function BottomNav() {
  const { t } = useTranslation()

  return (
    <nav
      className="md:hidden fixed bottom-0 start-0 end-0 bg-white z-50"
      style={{ borderTop: '0.5px solid #D0D8E0', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {navItems.map(({ key, icon: Icon, to }) => (
          <NavLink
            key={key}
            to={to}
            end={to === '/'}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors"
            style={({ isActive }) => ({ color: isActive ? '#1B3A5C' : '#AAB8C5' })}
          >
            {({ isActive }) => (
              <>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="leading-none">{t(`nav.${key}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
