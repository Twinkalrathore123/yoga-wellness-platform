import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

export default function LanguageToggle() {
  const { i18n, t } = useTranslation()

  // Keep <html lang="..."> in sync so the Devanagari font rule in index.css
  // and screen readers both pick up the correct language.
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const toggleLanguage = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi'
    i18n.changeLanguage(next)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="rounded-full border border-sage-400 px-4 py-1.5 text-sm font-medium text-sage-700 hover:bg-sage-100 transition-colors"
      aria-label={t('language.label')}
    >
      {i18n.language === 'hi' ? t('language.en') : t('language.hi')}
    </button>
  )
}
