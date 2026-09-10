import { getAll, updateOne } from './store.js'
import { sendEmail } from './email.js'

interface LiveSession {
  id: string
  title?: string
  trainer?: string
  scheduledAt?: string
  joinUrl?: string
  status?: string
  reminderMinutes?: number
}

interface Rsvp {
  id: string
  sessionId: string
  name: string
  email: string
  remindedAt?: string | null
}

const POLL_MS = (Number(process.env.REMINDER_POLL_SECONDS) || 60) * 1000
const DEFAULT_BEFORE_MINUTES = Number(process.env.REMINDER_BEFORE_MINUTES) || 30

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function reminderEmailHtml(session: LiveSession, name: string, startLabel: string): string {
  const title = escapeHtml(session.title || 'Your live session')
  const trainer = escapeHtml(session.trainer || 'Isôoko Coach')
  const joinLink = session.joinUrl
    ? `<p style="margin:0 0 24px;"><a href="${escapeHtml(session.joinUrl)}" style="background:#4B9F46;color:#ffffff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold;">Join the Live Session</a></p>`
    : ''

  return `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;background:#f6f3ef;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f3ef;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#17191F;padding:28px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;">Hi ${escapeHtml(name)}, your session is starting soon!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;">
              <h2 style="margin:0 0 8px;color:#17191F;">${title}</h2>
              <p style="margin:0 0 8px;color:#5C4A3E;">Trainer: <strong>${trainer}</strong></p>
              <p style="margin:0 0 24px;color:#5C4A3E;">Starts at: <strong>${escapeHtml(startLabel)}</strong></p>
              ${joinLink}
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
              <p style="margin:0;font-size:13px;color:#999;">
                Isôoko Community Development — Free community fitness for Masoro, Rwanda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function runReminderCheck(): Promise<number> {
  const [sessions, rsvps] = await Promise.all([
    getAll<LiveSession>('gym-live-sessions'),
    getAll<Rsvp>('gym-rsvps'),
  ])

  const now = Date.now()
  let sent = 0

  for (const session of sessions) {
    if (!session.scheduledAt) continue
    if (session.status === 'cancelled' || session.status === 'completed') continue

    const windowMs = (Number(session.reminderMinutes) || DEFAULT_BEFORE_MINUTES) * 60 * 1000
    const msLeft = new Date(session.scheduledAt).getTime() - now
    if (msLeft <= 0 || msLeft > windowMs) continue

    const startLabel = new Date(session.scheduledAt).toLocaleString()
    const toRemind = rsvps.filter(r => r.sessionId === session.id && !r.remindedAt)

    for (const rsvp of toRemind) {
      try {
        await sendEmail({
          to: rsvp.email,
          subject: `Reminder: ${session.title || 'your live session'} starts soon`,
          html: reminderEmailHtml(session, rsvp.name, startLabel),
        })
        await updateOne('gym-rsvps', rsvp.id, { remindedAt: new Date().toISOString() })
        sent += 1
        console.log(`[reminders] reminded ${rsvp.email} about "${session.title}"`)
      } catch (error) {
        console.error(`[reminders] failed to remind ${rsvp.email}:`, error)
      }
    }
  }

  return sent
}

export function startReminderScheduler(): NodeJS.Timeout {
  const timer = setInterval(() => {
    runReminderCheck().catch(error => console.error('[reminders] worker error:', error))
  }, POLL_MS)
  return timer
}