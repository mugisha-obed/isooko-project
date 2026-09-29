import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'
import { LIVE_ICE } from '@/lib/liveIce'

const HINTS_BEFORE_WAITING = 6
const BASE_RETRY_MS = 1500
const MAX_RETRY_MS = 10000

type PlayerStatus = 'connecting' | 'streaming' | 'waiting'

const log = (...args: unknown[]) => console.log('[gym-live viewer]', ...args)

export default function LivePlayer({ peerId, title }: { peerId: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState<PlayerStatus>('connecting')
  const [detail, setDetail] = useState('')
  const [ice, setIce] = useState('')
  const [attempt, setAttempt] = useState(0)

  // The peer connection opens as soon as this mounts, which is normally well
  // before the member taps to join. The incoming stream therefore has to be
  // buffered in a ref and attached to the <video> once it exists, otherwise
  // the event fires against a null ref and the video stays black forever.
  //
  // The trainer is often not broadcasting yet when a member opens the page, so
  // dialling keeps retrying with a capped backoff instead of giving up. A member
  // who taps while it is waiting restarts the attempts from scratch.
  useEffect(() => {
    let disposed = false
    let viewer: Peer | null = null
    let call: { close: () => void } | null = null
    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let tries = 0

    const teardown = () => {
      if (retryTimer) clearTimeout(retryTimer)
      retryTimer = null
      try { call?.close() } catch { /* already closed */ }
      call = null
      try { viewer?.destroy() } catch { /* already destroyed */ }
      viewer = null
    }

    const connect = () => {
      if (disposed) return
      teardown()
      tries += 1

      const peer = new Peer(crypto.randomUUID(), { config: LIVE_ICE })
      viewer = peer

      const retry = (reason?: string) => {
        if (disposed) return
        if (reason) setDetail(reason)
        if (tries >= HINTS_BEFORE_WAITING) setStatus('waiting')
        const delay = Math.min(BASE_RETRY_MS * tries, MAX_RETRY_MS)
        retryTimer = setTimeout(connect, delay)
      }

      peer.on('error', err => {
        log('peer error', err.type, err.message)
        retry(err.type === 'peer-unavailable' || err.type === 'network' ? 'Waiting for the trainer to start broadcasting…' : `Connection error: ${err.type}`)
      })

      peer.on('open', id => {
        log('viewer peer open', id)
        if (disposed) return
        const activeCall = peer.call(peerId, null as unknown as MediaStream)
        if (!activeCall) {
          retry('Waiting for the trainer to start broadcasting…')
          return
        }
        call = activeCall
        setStatus('connecting')
        setDetail('')
        log('call placed to', peerId)

        // The real question is which network path ICE managed to build, so
        // surface it instead of leaving a silent black box.
        const pc = (activeCall as unknown as { _pc?: RTCPeerConnection })._pc
        if (pc) {
          pc.oniceconnectionstatechange = () => {
            log('ice connection state', pc.iceConnectionState, 'gathering', pc.iceGatheringState)
            setIce(`${pc.iceConnectionState}`)
          }
          pc.onicegatheringstatechange = () => log('ice gathering', pc.iceGatheringState)
          pc.onicecandidate = e => log('candidate', e.candidate ? e.candidate.type : 'end-of-candidates')
        }

        activeCall.on('stream', stream => {
          if (disposed) return
          streamRef.current = stream
          setStatus('streaming')
          setDetail('')
          log('stream received', stream.getTracks().map(t => t.kind).join(','))
        })
        activeCall.on('close', () => retry('The trainer’s broadcast ended. Reconnecting…'))
        activeCall.on('error', err => {
          log('call error', err.type, err.message)
          retry('Could not reach the trainer. Reconnecting…')
        })
      })
    }

    setStatus('connecting')
    setDetail('')
    connect()

    return () => {
      disposed = true
      teardown()
    }
  }, [peerId, attempt])

  // Attach the buffered stream whenever the <video> finally exists.
  useEffect(() => {
    if (playing && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => { /* requires a user gesture */ })
    }
  }, [playing, status])

  const ready = status === 'streaming'
  const retryNow = () => {
    streamRef.current = null
    setAttempt(n => n + 1)
  }

  return (
    <div
      style={{
        position: 'relative',
        background: '#111',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        aspectRatio: '16/9',
      }}
    >
      {playing && ready && (
        <video ref={videoRef} controls playsInline autoPlay style={{ width: '100%', height: '100%', display: 'block', background: '#111' }} />
      )}
      {(!playing || !ready) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            color: '#fff',
            cursor: playing ? 'default' : 'pointer',
            textAlign: 'center',
            padding: 'var(--space-4)',
          }}
          onClick={() => !playing && setPlaying(true)}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: status === 'waiting' ? '#4b5563' : '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              color: '#fff',
            }}
          >
            ▶
          </span>
          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{title}</span>
          {!playing ? (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.7)' }}>Tap to join the live session</span>
          ) : status === 'waiting' ? (
            <>
              <span style={{ fontSize: 'var(--font-size-xs)', color: '#fca5a5', maxWidth: 280 }}>
                {detail || 'The trainer hasn’t started broadcasting yet. Please wait a moment.'}
              </span>
              <button
                onClick={retryNow}
                style={{ padding: '6px 14px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 'var(--font-size-xs)', fontWeight: 600, cursor: 'pointer' }}
              >
                Try again
              </button>
            </>
          ) : (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.7)' }}>Connecting to the trainer…</span>
          )}
          {playing && (
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace', maxWidth: 300, wordBreak: 'break-word' }}>
              attempt {attempt + 1}{ice ? ` · ice ${ice}` : ''}
              {streamRef.current ? ` · ${streamRef.current.getTracks().length} track(s)` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
