import { useTranslation } from 'react-i18next'

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
    <header className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between sticky top-0 z-40">
      <img src="/logo.png" alt="HYDRA" className="h-10 w-auto object-contain" />
      <button
        onClick={toggleLang}
        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:border-[#5BB8C5] hover:text-[#5BB8C5] transition-colors"
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
        className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 text-slate-600 hover:border-[#5BB8C5] hover:text-[#5BB8C5] transition-colors"
      >
        {isHebrew ? 'Switch to English' : 'עבור לעברית'}
      </button>
    </div>
  )
}
