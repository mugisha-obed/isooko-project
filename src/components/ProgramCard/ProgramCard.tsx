import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FaVenus, FaRocket, FaRunning, FaLaptop, FaChild, FaHeartbeat } from 'react-icons/fa'
import type { Program } from '../../data/programs'

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
    <article className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className="w-14 h-14 flex items-center justify-center bg-[#EADFD3] rounded-lg text-2xl text-[#4B9F46] flex-shrink-0"
        aria-hidden="true"
      >
        {ICONS[program.icon]}
      </div>
      <h3 className="text-xl font-bold text-[#17191F]">{t(program.titleKey)}</h3>
      <p className="text-sm font-semibold mb-2 text-[#B6582A]">{t(program.subtitleKey)}</p>
      <p className="text-base text-[#5C4A3E] leading-relaxed flex-1">{t(program.descKey)}</p>
      <Link
        to={`/programs#${program.id}`}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#4B9F46] no-underline transition-all hover:gap-2 hover:text-[#3a7d37]"
      >
        {tc('btn.readMore')} →
      </Link>
    </article>
  )
}
