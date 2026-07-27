import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import LanguageToggle from './LanguageToggle.jsx'

const links = [
  { to: '/', key: 'home' },
  { to: '/poses', key: 'poses' },
  { to: '/videos', key: 'videos' },
  { to: '/predict', key: 'predict' },
  { to: '/chatbot', key: 'chatbot' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-sage-50/95 backdrop-blur border-b border-sage-200">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-display text-2xl font-semibold text-sage-700">
          Yoga & Wellness
        </NavLink>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.key}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors ${
                    isActive ? 'text-clay-600' : 'text-ink/70 hover:text-ink'
                  }`
                }
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageToggle />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center border border-sage-300 text-sage-700 hover:bg-sage-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-1 px-6 pb-4">
          {links.map((link) => (
            <li key={link.key}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                    isActive ? 'bg-sage-100 text-clay-600' : 'text-ink/70 hover:bg-sage-100'
                  }`
                }
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}