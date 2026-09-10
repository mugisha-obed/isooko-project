import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { FaPlay } from 'react-icons/fa'

interface LivePlayerProps {
  src: string
  title?: string
}

export default function LivePlayer({ src, title }: LivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.addEventListener('loadedmetadata', () => setFailed(false))
    } else if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => setFailed(false))
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) {
          setFailed(true)
          hls?.destroy()
          hls = null
        }
      })
    } else {
      setFailed(true)
    }

    return () => {
      hls?.destroy()
      video.removeAttribute('src')
      video.load()
    }
  }, [src])

  return (
    <div style={{ position: 'relative', background: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        controls
        playsInline
        title={title}
        style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#000' }}
      />
      {!playing && !failed && (
        <button
          onClick={() => { videoRef.current?.play(); setPlaying(true) }}
          aria-label="Play live"
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <span style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaPlay size={24} style={{ color: '#17191F', marginLeft: 4 }} />
          </span>
        </button>
      )}
      {failed && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: 'var(--font-size-sm)', textAlign: 'center', padding: 'var(--space-4)' }}>
          The stream isn't broadcasting yet. Watch the LIVE badge — it appears once the trainer goes on air.
        </div>
      )}
    </div>
  )
}