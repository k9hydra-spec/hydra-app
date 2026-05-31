import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header, SidebarLangSwitch } from './Header'

export function Layout() {
  return (
    <div className="flex h-dvh bg-white overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-64 shrink-0 border-e border-slate-200 bg-white shadow-sm overflow-y-auto">
        <Sidebar />
        <SidebarLangSwitch />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <Header />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6"
          style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
