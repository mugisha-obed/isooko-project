import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styles from './VolunteerForm.module.css'

interface VolunteerFormData {
  name: string
  email: string
  phone?: string
  areaOfInterest: string
  message: string
}

const AREAS = [
  'Teaching',
  'Healthcare',
  'Community Outreach',
  'Fundraising',
  'Other',
]

export default function VolunteerForm() {
  const { t } = useTranslation('getInvolved')
  const { t: tc } = useTranslation('common')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormData>()

  const onSubmit = async (data: VolunteerFormData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        await fetch(`${apiUrl}/volunteer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      }
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      {status === 'success' && (
        <div className={styles.successBanner} role="alert">
          {t('volunteer.success')}
        </div>
      )}
      {status === 'error' && (
        <div className={styles.errorBanner} role="alert">
          Error submitting form. Please try again.
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="vf-name" className={styles.label}>{t('volunteer.fields.name')}</label>
          <input
            id="vf-name"
            type="text"
            className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
            {...register('name', { required: true })}
            aria-invalid={!!errors.name}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="vf-email" className={styles.label}>{t('volunteer.fields.email')}</label>
          <input
            id="vf-email"
            type="email"
            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
            {...register('email', {
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            })}
            aria-invalid={!!errors.email}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="vf-phone" className={styles.label}>{t('volunteer.fields.phone')}</label>
          <input
            id="vf-phone"
            type="tel"
            className={styles.input}
            {...register('phone')}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="vf-area" className={styles.label}>{t('volunteer.fields.area')}</label>
          <select
            id="vf-area"
            className={`${styles.input} ${errors.areaOfInterest ? styles.inputError : ''}`}
            {...register('areaOfInterest', { required: true })}
            aria-invalid={!!errors.areaOfInterest}
          >
            <option value="">— Select —</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="vf-message" className={styles.label}>{t('volunteer.fields.message')}</label>
        <textarea
          id="vf-message"
          rows={4}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          {...register('message', { required: true })}
          aria-invalid={!!errors.message}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? tc('loading') : tc('btn.submit')}
      </button>
    </form>
  )
}
