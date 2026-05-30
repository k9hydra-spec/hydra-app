import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { Header, SidebarLangSwitch } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar — fixed */}
      <div className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen border-e border-slate-200 bg-white shadow-sm">
        <Sidebar />
        <SidebarLangSwitch />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <Header />

        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
