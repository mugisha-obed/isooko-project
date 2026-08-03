import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaVenus, FaRocket, FaRunning, FaLaptop, FaChild, FaHeartbeat } from 'react-icons/fa'
import type { Program } from '../../data/programs'
import styles from './ProgramCard.module.css'

const ICONS: Record<string, React.ReactNode> = {
  FaVenus: <FaVenus />,
  FaRocket: <FaRocket />,
  FaRunning: <FaRunning />,
  FaLaptop: <FaLaptop />,
  FaChild: <FaChild />,
  FaHeartbeat: <FaHeartbeat />,
}

interface ProgramCardProps {
  program: Program
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const { t } = useTranslation('programs')
  const { t: tc } = useTranslation('common')

  return (
    <article className={styles.card}>
      <div className={styles.iconWrap} aria-hidden="true">
        {ICONS[program.icon]}
      </div>
      <h3 className={styles.title}>{t(program.titleKey)}</h3>
      <p className={styles.subtitle} style={{ color: 'var(--color-terracotta)', fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
        {t(program.subtitleKey)}
      </p>
      <p className={styles.desc}>{t(program.descKey)}</p>
      <Link
        to={`/programs#${program.id}`}
        className={styles.link}
      >
        {tc('btn.readMore')} →
      </Link>
    </article>
  )
}
