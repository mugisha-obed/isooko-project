/**
 * ICE configuration shared by the gym broadcaster and viewer.
 *
 * STUN alone is not enough for members watching from home: most mobile ISPs in
 * the region sit behind carrier-grade NAT, so a STUN-only peer connection has
 * no candidate route and the video never arrives. TURN relays traffic through a
 * third-party server, which makes the connection work on restrictive networks.
 *
 * The default relays are the free Open Relay Project servers. Override them with
 * VITE_TURN_URL / VITE_TURN_USERNAME / VITE_TURN_CREDENTIAL if you later run
 * your own relay (recommended for anything beyond a small community audience).
 */
const DEFAULT_TURN = {
  urls: [
    'turn:openrelay.metered.ca:80',
    'turn:openrelay.metered.ca:443',
    'turn:openrelay.metered.ca:443?transport=tcp',
  ],
  username: 'openrelayproject',
  credential: 'openrelayproject',
}

function buildIceServers(): RTCIceServer[] {
  const turnUrl = import.meta.env.VITE_TURN_URL as string | undefined
  const turnUsername = import.meta.env.VITE_TURN_USERNAME as string | undefined
  const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL as string | undefined

  const servers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
  ]

  const urls = turnUrl ? turnUrl.split(',').map(u => u.trim()).filter(Boolean) : DEFAULT_TURN.urls
  servers.push({
    urls,
    username: turnUsername || DEFAULT_TURN.username,
    credential: turnCredential || DEFAULT_TURN.credential,
  })

  return servers
}

export const LIVE_ICE: RTCConfiguration = {
  iceServers: buildIceServers(),
  // Wait for a relay candidate before giving up; this is what rescues peers that
  // STUN alone cannot pair.
  iceTransportPolicy: 'all',
}

/**
 * Signalling path, matching `path` in the ExpressPeerServer options in
 * server/src/index.ts.
 *
 * The trailing slash is required. The PeerJS client builds its WebSocket URL as
 * `{path}peerjs`, and the server's WebSocket listener is registered at
 * `{path}/peerjs`. With the slash we get /peerjs/peerjs on both sides, which is
 * what the listener expects. Dropping the slash yields /peerjspeerjs and every
 * handshake fails with HTTP 400.
 */
export const PEER_SERVER_PATH = '/peerjs/'

/**
 * Where the WebRTC signalling handshake goes.
 *
 * Defaults to this app's own origin, because the signalling server is mounted
 * on the same Express process (see server/src/index.ts). That keeps the
 * handshake on one host instead of depending on the free PeerJS cloud, which is
 * unreachable/throttled often enough to break the gym stream entirely.
 *
 * VITE_PEER_HOST / VITE_PEER_PORT are only needed when signalling is served
 * from a different origin than the site.
 */
type PeerEndpoint = {
  host: string
  port: number
  secure: boolean
}

/**
 * The signalling server is mounted on the API process, not on the static site
 * (see server/src/index.ts). When the two are deployed on different origins —
 * the usual split, e.g. Vercel for the SPA and Render for the API — pointing the
 * handshake at window.location sends the WebSocket to the static host, which has
 * no /peerjs endpoint. The socket then never opens and every member dials a void
 * while the admin panel still shows ON AIR.
 *
 * VITE_API_URL is therefore the source of truth for where signalling lives.
 */
function apiEndpoint(): PeerEndpoint | null {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined
  if (!apiUrl || /localhost|127\.0\.0\.1/.test(apiUrl)) return null
  try {
    const url = new URL(apiUrl)
    const secure = url.protocol === 'https:'
    return {
      host: url.hostname,
      port: Number(url.port) || (secure ? 443 : 80),
      secure,
    }
  } catch {
    return null
  }
}

export function peerServerOptions(): {
  host: string
  port: number
  path: string
  secure: boolean
  config: RTCConfiguration
} {
  const isDev = Boolean(import.meta.env.DEV)
  const envHost = import.meta.env.VITE_PEER_HOST as string | undefined
  const envPort = import.meta.env.VITE_PEER_PORT as string | undefined

  // VITE_PEER_HOST may include a scheme, e.g. https://signalling.example.com.
  if (envHost) {
    const secure = envHost.startsWith('http://') ? false : true
    return {
      host: envHost.replace(/^https?:\/\//, '').replace(/\/+$/, ''),
      port: Number(envPort) || 443,
      path: PEER_SERVER_PATH,
      secure,
      config: LIVE_ICE,
    }
  }

  // In dev the site is served by Vite (5173) while the API and signalling
  // server live on 3001.
  if (isDev) {
    return {
      host: window.location.hostname,
      port: Number(envPort) || 3001,
      path: PEER_SERVER_PATH,
      secure: false,
      config: LIVE_ICE,
    }
  }

  const endpoint =
    apiEndpoint() ??
    (() => {
      const secure = window.location.protocol === 'https:'
      return {
        host: window.location.hostname,
        port: Number(window.location.port) || (secure ? 443 : 80),
        secure,
      } satisfies PeerEndpoint
    })()

  return {
    host: endpoint.host,
    port: Number(envPort) || endpoint.port,
    path: PEER_SERVER_PATH,
    secure: endpoint.secure,
    config: LIVE_ICE,
  }
}

export const HEARTBEAT_INTERVAL_MS = 15000
export const HEARTBEAT_TIMEOUT_MS = 45000
