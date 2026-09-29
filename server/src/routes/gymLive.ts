import { Router } from 'express'
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
}

export function peerIdFor(sessionId: string): string {
  return `isooko-live-${sessionId}`
}

/** A session is on air when the broadcaster has actually started streaming. */
export function isOnAir(session: LiveSession): boolean {
  return session.broadcastStatus === 'live' && session.status !== 'cancelled'
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

    const peerId = peerIdFor(session.id)
    await updateOne('gym-live-sessions', session.id, {
      streamId: peerId,
      broadcastStatus: 'live',
      status: 'active',
    })

    res.status(201).json({ peerId, streamId: peerId })
  } catch (error) {
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