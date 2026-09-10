import { Router } from 'express'
import { getById, updateOne } from '../store.js'
import { requireAdmin } from '../auth.js'

const router = Router()

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN = process.env.CLOUDFLARE_STREAM_API_TOKEN

const CF_BASE = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`

function isConfigured(): boolean {
  return Boolean(ACCOUNT_ID && API_TOKEN)
}

export function hlsUrlFor(streamId: string): string {
  return `https://customer-${ACCOUNT_ID}.cloudflarestream.com/${streamId}/manifest/video.m3u8`
}

export function whipUrlFor(streamId: string): string {
  return `https://customer-${ACCOUNT_ID}.cloudflarestream.com/${streamId}/whip`
}

async function cfFetch(path: string, init?: RequestInit): Promise<{ ok: boolean; data?: any; error?: string }> {
  const res = await fetch(`${CF_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers || {}),
    },
  })
  const json = (await res.json().catch(() => ({}))) as {
    result?: any
    errors?: { message?: string }[]
    error?: string
  }
  if (!res.ok) {
    const message = Array.isArray(json.errors) && json.errors.length > 0
      ? json.errors[0].message || 'Cloudflare Stream API error'
      : json.error
    return { ok: false, error: message }
  }
  return { ok: true, data: json.result }
}

interface LiveSession {
  id: string
  title?: string
  status?: string
  streamId?: string
  hlsUrl?: string
  broadcastStatus?: string
}

// Admin: create a Cloudflare Stream live input for a session. The browser then
// pushes the camera feed to the WHIP ingest URL returned here.
router.post('/start/:sessionId', requireAdmin, async (req, res) => {
  if (!isConfigured()) {
    res.status(503).json({ error: 'Cloudflare Stream is not configured on this server.' })
    return
  }
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found' })
      return
    }
    if (session.streamId) {
      res.json({
        streamId: session.streamId,
        whipUrl: whipUrlFor(session.streamId),
        hlsUrl: session.hlsUrl || hlsUrlFor(session.streamId),
      })
      return
    }

    const created = await cfFetch('/live_inputs', {
      method: 'POST',
      body: JSON.stringify({
        meta: { name: session.title || 'Gym live session' },
        recording: { mode: 'off' },
      }),
    })
    if (!created.ok || !created.data?.uid) {
      res.status(502).json({ error: created.error || 'Failed to create live input on Cloudflare Stream' })
      return
    }
    const streamId = created.data.uid
    const hlsUrl = hlsUrlFor(streamId)

    await updateOne('gym-live-sessions', session.id, {
      streamId,
      hlsUrl,
      broadcastStatus: 'live',
      status: 'active',
    })

    res.status(201).json({ streamId, whipUrl: whipUrlFor(streamId), hlsUrl })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Admin: stop the broadcast for a session.
router.post('/stop/:sessionId', requireAdmin, async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (session?.streamId && isConfigured()) {
      const removed = await cfFetch(`/live_inputs/${session.streamId}`, { method: 'DELETE' })
      if (!removed.ok && removed.error?.toLowerCase().includes('not found')) {
        // input already gone — fine
      }
    }
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

// Public: current broadcast status for a session.
router.get('/status/:sessionId', async (req, res) => {
  try {
    const session = await getById<LiveSession>('gym-live-sessions', req.params.sessionId)
    if (!session) {
      res.status(404).json({ error: 'Session not found' })
      return
    }
    if (!session.streamId) {
      res.json({ live: false, hlsUrl: null, streamId: null })
      return
    }

    let live = session.broadcastStatus === 'live'
    if (session.streamId && isConfigured()) {
      try {
        const state = await cfFetch(`/live_inputs/${session.streamId}`)
        const currentState = state.data?.status?.currentState
        const cfLive = currentState === 'live' || currentState === 'active'
        if (typeof cfLive === 'boolean') live = cfLive
      } catch {
        // keep stored status
      }
    }

    res.json({ live, hlsUrl: session.hlsUrl || null, streamId: session.streamId })
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router