import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header, SidebarLangSwitch } from './Header'

export function Layout() {
  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: '#F0F4F8' }}>

      {/* Desktop sidebar — first in DOM = right side in RTL */}
      <div
        className="hidden md:flex flex-col w-64 shrink-0 bg-white overflow-y-auto"
        style={{ borderInlineStart: '0.5px solid #D0D8E0' }}
      >
        <Sidebar />
        <SidebarLangSwitch />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <Header />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            padding: '24px 20px',
            paddingBottom: 'calc(88px + env(safe-area-inset-bottom))',
          }}
        >
          <div className="max-w-2xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
