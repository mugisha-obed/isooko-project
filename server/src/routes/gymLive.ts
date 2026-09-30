import { Router } from 'express'
import { randomBytes } from 'crypto'
import { getAll, getById, updateOne } from '../store.js'
import { requireAdmin } from '../auth.js'

const router = Router()

interface LiveSession {
  id: string
  title?: string
  scheduledAt?: string
  duration?: number
  status?: string
  streamId?: string
  hlsUrl?: string
  broadcastStatus?: string
  liveHeartbeatAt?: string
}

export function peerIdFor(sessionId: string): string {
  return `isooko-live-${sessionId}`
}

/**
 * A fresh peer id for one broadcast.
 *
 * The signalling server holds a claimed id until it notices the socket is gone
 * (`alive_timeout`, 90s by default), so a broadcaster tab that was closed or
 * crashed without a clean disconnect leaves `isooko-live-<sessionId>` reserved
 * and the trainer's next Go Live fails with 'unavailable-id'. Deriving the id
 * from a fixed string made every retry collide with that stale claim. Each
 * /start now mints a unique id instead, and viewers read it back from
 * streamId, so a stale reservation can never block a new broadcast.
 */
export function newPeerIdFor(sessionId: string): string {
  return `${peerIdFor(sessionId)}-${randomBytes(4).toString('hex')}`
}

/**
 * A broadcaster that closes the tab or loses network dies without ever calling
 * /stop, so `broadcastStatus` alone would leave a phantom LIVE badge that no
 * viewer can ever connect to. Liveness therefore also requires a recent
 * heartbeat from the broadcasting browser.
 */
export const HEARTBEAT_TIMEOUT_MS = 45000

export function isOnAir(session: LiveSession): boolean {
  if (session.broadcastStatus !== 'live' || session.status === 'cancelled') return false
  // No heartbeat means the flag is unverified: either the broadcaster's tab was
  // closed (leaving a LIVE badge nobody can connect to) or the flag predates
  // heartbeats. Either way it is not on air, so it is hidden and the trainer
  // simply presses Go Live again. A genuine broadcast heartbeats immediately
  // on start, so this never hides a real one.
  if (!session.liveHeartbeatAt) return false
  return Date.now() - new Date(session.liveHeartbeatAt).getTime() < HEARTBEAT_TIMEOUT_MS
}

function endOfScheduledWindow(session: LiveSession): number {
  const start = new Date(session.scheduledAt || 0).getTime()
  return start + (Number(session.duration) || 60) * 60 * 1000
}

// Admin: mark a session as live. The browser then begins broadcasting to the
// member-facing site directly over WebRTC (PeerJS), using the peer id below.
router.post('/start/:sessionId', requireAdmin, async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found' })
      return
    }
    if (session.status === 'cancelled') {
      res.status(400).json({ error: 'Cannot broadcast a cancelled session' })
      return
    }

    const peerId = newPeerIdFor(session.id)
    await updateOne('gym-live-sessions', session.id, {
      streamId: peerId,
      broadcastStatus: 'live',
      status: 'active',
      liveHeartbeatAt: new Date().toISOString(),
    })

    res.status(201).json({ peerId, streamId: peerId })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin: the broadcasting browser keeps this alive while it is streaming. If it
// stops arriving, the session is treated as no longer on air.
router.post('/heartbeat/:sessionId', requireAdmin, async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found' })
      return
    }
    if (session.broadcastStatus !== 'live') {
      res.status(409).json({ error: 'Session is not broadcasting' })
      return
    }
    await updateOne('gym-live-sessions', session.id, { liveHeartbeatAt: new Date().toISOString() })
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin: stop the broadcast for a session. The session is marked completed so
// members can find it in the past-sessions archive instead of it silently
// disappearing. Stopping then re-starting is still allowed (start sets 'active').
router.post('/stop/:sessionId', requireAdmin, async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (session) {
      await updateOne('gym-live-sessions', session.id, {
        broadcastStatus: 'stopped',
        status: 'completed',
        endedAt: new Date().toISOString(),
        liveHeartbeatAt: '',
      })
    }
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Public: every session that is broadcasting right now, with the peer id each
// viewer should dial. Liveness comes from the broadcaster, never from the
// client's clock, so a session that starts late or runs over stays reachable.
router.get('/live', async (_req, res) => {
  try {
    const sessions = await getAll<LiveSession>('gym-live-sessions')
    const live = sessions
      .filter(isOnAir)
      .map(session => ({
        id: session.id,
        title: session.title,
        scheduledAt: session.scheduledAt,
        duration: session.duration,
        streamId: session.streamId || peerIdFor(session.id),
        peerId: session.streamId || peerIdFor(session.id),
        broadcastStatus: session.broadcastStatus,
      }))
    res.json(live)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Public: current broadcast status (peer id the browser should connect to).
router.get('/status/:sessionId', async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found' })
      return
    }

    const live = isOnAir(session)
    const ended = !live && Date.now() > endOfScheduledWindow(session)
    res.json({
      live,
      ended,
      peerId: live ? session.streamId || peerIdFor(session.id) : null,
      streamId: session.streamId || null,
    })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router