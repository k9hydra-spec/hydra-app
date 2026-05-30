import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function Header() {
  const { i18n } = useTranslation()
  const isHebrew = i18n.language === 'he'

  const toggleLang = () => {
    const next = isHebrew ? 'en' : 'he'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  return (
    <header className="md:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-2 min-w-0">
        <img src="/logo.png" alt="HYDRA" className="w-9 h-9 rounded-full object-cover shrink-0" />
        <span className="font-bold text-slate-800 truncate">HYDRA</span>
      </div>

      <button
        onClick={toggleLang}
        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors shrink-0 ms-2"
      >
        {isHebrew ? 'EN' : 'עב'}
      </button>
    </header>
  )
}

export function SidebarLangSwitch() {
  const { i18n } = useTranslation()
  const isHebrew = i18n.language === 'he'

  const toggleLang = () => {
    const next = isHebrew ? 'en' : 'he'
    i18n.changeLanguage(next)
    document.documentElement.dir = next === 'he' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  return (
    <div className="hidden md:block px-4 py-3 border-t border-slate-100">
      <button
        onClick={toggleLang}
        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:border-[#1D9E75] hover:text-[#1D9E75] transition-colors"
      >
        {isHebrew ? 'Switch to English' : 'עבור לעברית'}
      </button>
    </div>
  )
}
