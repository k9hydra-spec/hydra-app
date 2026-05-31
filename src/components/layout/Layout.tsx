import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header, SidebarLangSwitch } from './Header'

export function Layout() {
  return (
    <div className="flex h-dvh bg-white overflow-hidden">

      {/* Desktop sidebar — right side in RTL */}
      <div className="hidden md:flex flex-col w-64 shrink-0 border-s border-slate-200 bg-white overflow-y-auto order-last">
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
            padding: '20px 16px',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
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
