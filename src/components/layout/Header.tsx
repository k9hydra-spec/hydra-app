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
    <header className="md:hidden bg-white sticky top-0 z-40" style={{ borderBottom: '0.5px solid #D0D8E0' }}>
      <div className="flex items-center justify-between px-5" style={{ paddingTop: 14, paddingBottom: 14 }}>
        <button
          onClick={toggleLang}
          className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
          style={{ border: '0.5px solid #D0D8E0', color: '#7A8A9A' }}
        >
          {isHebrew ? 'EN' : 'עב'}
        </button>
        <img src="/logo.png" alt="HYDRA" style={{ height: 46, width: 'auto', objectFit: 'contain' }} />
      </div>
      <div style={{ height: 6 }} />
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
    <div className="hidden md:block px-5 py-4" style={{ borderTop: '0.5px solid #D0D8E0' }}>
      <button
        onClick={toggleLang}
        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors"
        style={{ border: '0.5px solid #D0D8E0', color: '#7A8A9A' }}
      >
        {isHebrew ? 'Switch to English' : 'עבור לעברית'}
      </button>
    </div>
  )
}
