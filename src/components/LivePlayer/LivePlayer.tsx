import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

const MAX_ATTEMPTS = 8
const BASE_RETRY_MS = 1500

export default function LivePlayer({ peerId, title }: { peerId: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState<'connecting' | 'streaming' | 'waiting'>('connecting')

  // The peer connection opens as soon as this mounts, which is normally well
  // before the member taps to join. The incoming stream therefore has to be
  // buffered in a ref and attached to the <video> once it exists, otherwise
  // the event fires against a null ref and the video stays black forever.
  useEffect(() => {
    let disposed = false
    let viewer: Peer | null = null
    let call: { close: () => void } | null = null
    let retryTimer: ReturnType<typeof setTimeout> | null = null
    let attempt = 0

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
      attempt += 1
      setStatus('connecting')

      const peer = new Peer(crypto.randomUUID(), { config: ICE })
      viewer = peer

      // The broadcaster may not have registered its peer yet, so back off and
      // redial instead of giving up on the first miss.
      const retry = () => {
        if (disposed) return
        if (attempt >= MAX_ATTEMPTS) {
          setStatus('waiting')
          return
        }
        retryTimer = setTimeout(connect, BASE_RETRY_MS * attempt)
      }

      peer.on('error', retry)
      peer.on('open', () => {
        if (disposed) return
        const activeCall = peer.call(peerId, null as unknown as MediaStream)
        if (!activeCall) {
          retry()
          return
        }
        call = activeCall
        activeCall.on('stream', stream => {
          if (disposed) return
          streamRef.current = stream
          setStatus('streaming')
        })
        activeCall.on('close', retry)
        activeCall.on('error', retry)
      })
    }

    connect()

    return () => {
      disposed = true
      teardown()
    }
  }, [peerId])

  // Attach the buffered stream whenever the <video> finally exists.
  useEffect(() => {
    if (playing && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => { /* requires a user gesture */ })
    }
  }, [playing, status])

  const ready = status === 'streaming'

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
          {status === 'waiting' ? (
            <span style={{ fontSize: 'var(--font-size-xs)', color: '#fca5a5' }}>
              The trainer hasn't started broadcasting yet. Refresh this page in a moment.
            </span>
          ) : !playing ? (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.7)' }}>Tap to join the live session</span>
          ) : (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.7)' }}>Connecting to the trainer…</span>
          )}
        </div>
      )}
    </div>
  )
}
