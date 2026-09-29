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

export const HEARTBEAT_INTERVAL_MS = 15000
export const HEARTBEAT_TIMEOUT_MS = 45000
