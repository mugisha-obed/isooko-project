import { useEffect, useRef, useState } from 'react'
import Peer from 'peerjs'

const ICE = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }

export default function LivePlayer({ peerId, title }: { peerId: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const viewer = new Peer(crypto.randomUUID(), { config: ICE })
    let call: { close: () => void } | null = null

    viewer.on('error', () => setFailed(true))
    viewer.on('open', () => {
      const c = viewer.call(peerId, null as unknown as MediaStream)
      if (!c) return
      call = c
      c.on('stream', stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setFailed(false)
        }
      })
      c.on('error', () => setFailed(true))
    })

    return () => {
      call?.close()
      viewer.destroy()
    }
  }, [peerId])

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
      {playing && (
        <video ref={videoRef} controls playsInline autoPlay style={{ width: '100%', height: '100%', display: 'block', background: '#111' }} />
      )}
      {!playing && (
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
            cursor: 'pointer',
            textAlign: 'center',
            padding: 'var(--space-4)',
          }}
          onClick={() => setPlaying(true)}
        >
          <span
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#dc2626',
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
          {failed ? (
            <span style={{ fontSize: 'var(--font-size-xs)', color: '#fca5a5' }}>
              The stream isn't available yet. If you're joining early, wait a moment and tap again.
            </span>
          ) : (
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.7)' }}>Tap to join the live session</span>
          )}
        </div>
      )}
    </div>
  )
}