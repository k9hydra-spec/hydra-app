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
    <header className="md:hidden bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-5 py-3">
        <button
          onClick={toggleLang}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-300 text-slate-500 hover:border-[#5BB8C5] hover:text-[#5BB8C5] transition-colors"
        >
          {isHebrew ? 'EN' : 'עב'}
        </button>
        <img src="/logo.png" alt="HYDRA" className="h-12 w-auto object-contain" />
      </div>
      <div className="h-3" />
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
    <div className="hidden md:block px-5 py-4 border-t border-slate-100">
      <button
        onClick={toggleLang}
        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:border-[#5BB8C5] hover:text-[#5BB8C5] transition-colors"
      >
        {isHebrew ? 'Switch to English' : 'עבור לעברית'}
      </button>
    </div>
  )
}
