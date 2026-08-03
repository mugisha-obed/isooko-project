import { useTranslation } from 'react-i18next'
import styles from './LanguageSwitcher.module.css'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'rw', label: 'RW' },
  { code: 'fr', label: 'FR' },
] as const

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('isooko-lang', code)
  }

  return (
    <div className={styles.wrapper} role="group" aria-label="Select language">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          aria-pressed={i18n.language.startsWith(code)}
          className={`${styles.btn} ${i18n.language.startsWith(code) ? styles.active : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
