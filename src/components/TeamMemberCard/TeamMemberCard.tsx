import { useTranslation } from 'react-i18next'
import { FaUserTag, FaQuoteLeft } from 'react-icons/fa'
import type { TeamMember } from '../../data/teamMembers'
import styles from './TeamMemberCard.module.css'

interface TeamMemberCardProps {
  member: TeamMember
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const { t } = useTranslation('about')

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={member.photo}
          alt={member.name}
          className={styles.photo}
          loading="lazy"
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}><FaUserTag className={styles.roleIcon} aria-hidden="true" /> {t(member.roleKey)}</p>
        {member.quote && <p className={styles.quote}><FaQuoteLeft className={styles.quoteIcon} aria-hidden="true" /> {t(member.quote)}</p>}
      </div>
    </article>
  )
}
