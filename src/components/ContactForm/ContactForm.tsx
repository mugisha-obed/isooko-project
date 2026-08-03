import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styles from './ContactForm.module.css'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactForm() {
  const { t } = useTranslation('contact')
  const { t: tc } = useTranslation('common')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>()

  const onSubmit = async (data: ContactFormData) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      if (apiUrl) {
        await fetch(`${apiUrl}/contact`, {
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
          {t('form.success')}
        </div>
      )}
      {status === 'error' && (
        <div className={styles.errorBanner} role="alert">
          {t('form.error')}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="cf-name" className={styles.label}>{t('form.name')}</label>
        <input
          id="cf-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          {...register('name', { required: true })}
          aria-invalid={!!errors.name}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-email" className={styles.label}>{t('form.email')}</label>
        <input
          id="cf-email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
          {...register('email', {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          })}
          aria-invalid={!!errors.email}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-subject" className={styles.label}>{t('form.subject')}</label>
        <input
          id="cf-subject"
          type="text"
          className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
          {...register('subject', { required: true })}
          aria-invalid={!!errors.subject}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="cf-message" className={styles.label}>{t('form.message')}</label>
        <textarea
          id="cf-message"
          rows={5}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
          {...register('message', { required: true })}
          aria-invalid={!!errors.message}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? tc('loading') : t('form.submit')}
      </button>
    </form>
  )
}
