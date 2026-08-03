import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useCounter } from '@/hooks/useCounter'
import type { ImpactStat } from '@/data/impactStats'
import styles from './ImpactCounter.module.css'

interface ImpactCounterProps {
  stat: ImpactStat
}

export default function ImpactCounter({ stat }: ImpactCounterProps) {
  const { t } = useTranslation('impact')
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.3 })
  const count = useCounter(stat.value, 1500, isVisible)

  return (
    <div ref={ref} className={styles.counter}>
      <span className={styles.number}>
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span className={styles.label}>{t(stat.labelKey)}</span>
    </div>
  )
}
