import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUsers, FaVenus, FaChild, FaBaby, FaStore, FaHeartbeat } from 'react-icons/fa'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useCounter } from '@/hooks/useCounter'
import type { ImpactStat } from '@/data/impactStats'

const STAT_ICONS: Record<string, React.ReactElement> = {
  beneficiaries: <FaUsers />,
  women: <FaVenus />,
  youth: <FaChild />,
  ecd: <FaBaby />,
  businesses: <FaStore />,
  wellness: <FaHeartbeat />,
}

interface ImpactCounterProps {
  stat: ImpactStat
}

export default function ImpactCounter({ stat }: ImpactCounterProps) {
  const { t } = useTranslation('impact')
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(ref, { threshold: 0.3 })
  const count = useCounter(stat.value, 1500, isVisible)

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6">
      <span className="text-white/80 mb-3 text-2xl" aria-hidden="true">{STAT_ICONS[stat.id]}</span>
      <span className="text-3xl md:text-4xl font-bold text-white leading-none mb-2">
        {count.toLocaleString()}{stat.suffix}
      </span>
      <span className="text-base md:text-lg text-white/80 font-medium">{t(stat.labelKey)}</span>
    </div>
  )
}
