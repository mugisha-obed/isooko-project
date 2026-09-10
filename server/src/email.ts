import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const SMTP_FROM = process.env.SMTP_FROM || 'Isôoko Community Development <noreply@isooko.org>'

const transport = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null

export interface EmailMessage {
  to: string
  subject: string
  html: string
}

export async function sendEmail(message: EmailMessage): Promise<void> {
  if (!transport) {
    console.log(`[email] SMTP not configured — email not sent to ${message.to}: ${message.subject}`)
    return
  }
  await transport.sendMail({
    from: SMTP_FROM,
    to: message.to,
    subject: message.subject,
    html: message.html,
  })
}

export function emailTransportConfigured(): boolean {
  return transport !== null
}