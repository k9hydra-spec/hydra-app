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
    <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: '#1D9E75' }}
        >
          H
        </div>
        <span className="font-bold text-slate-800">HYDRA</span>
      </div>

      <button
        onClick={toggleLang}
        className={cn(
          'text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors',
          'border-slate-300 text-slate-600 hover:border-[#1D9E75] hover:text-[#1D9E75]'
        )}
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
