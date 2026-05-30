import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header, SidebarLangSwitch } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-e border-slate-200 bg-white shadow-sm">
        <Sidebar />
        <SidebarLangSwitch />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header />
        <main
          className="flex-1 p-4 md:p-6 overflow-y-auto"
          style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom))' }}
        >
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
