import { Router } from 'express'
import { getById, updateOne } from '../store.js'
import { requireAdmin } from '../auth.js'

const router = Router()

interface LiveSession {
  id: string
  title?: string
  status?: string
  streamId?: string
  hlsUrl?: string
  broadcastStatus?: string
}

export function peerIdFor(sessionId: string): string {
  return `isooko-live-${sessionId}`
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

// Admin: stop the broadcast for a session.
router.post('/stop/:sessionId', requireAdmin, async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (session) {
      await updateOne('gym-live-sessions', session.id, {
        broadcastStatus: 'stopped',
        status: 'upcoming',
      })
    }
    res.json({ success: true })
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

    const live = session.broadcastStatus === 'live' && session.status === 'active'
    res.json({
      live,
      peerId: live ? session.streamId || peerIdFor(session.id) : null,
      streamId: session.streamId || null,
    })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router