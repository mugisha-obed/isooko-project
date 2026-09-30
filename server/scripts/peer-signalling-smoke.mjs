/**
 * Smoke test for the self-hosted WebRTC signalling server.
 *
 * Verifies that a member's call actually reaches the broadcaster, which is the
 * failure that showed up in production as "ON AIR" with "0 watching" and members
 * stuck on "connecting".
 *
 * Usage (server must already be running on port 3001):
 *   node server/scripts/peer-signalling-smoke.mjs [ws-path]
 *
 * The optional argument is the WebSocket path, which must match what the browser
 * client builds from PEER_SERVER_PATH in src/lib/liveIce.ts. It is not the same
 * as the server's own `path` option in server/src/index.ts, because the PeerJS
 * client appends the literal "peerjs" segment to the path it is given.
 */
import WebSocket from 'ws'
import { randomBytes } from 'node:crypto'

// Mirrors peerjs 1.5.5 client: ws(s)://host:port{path}peerjs?key={key}&id={id}&token={token}&version=X
// The client appends the literal segment "peerjs" to `path`, so `path` must end with a slash.
const CLIENT_VERSION = '1.5.5'
const KEY = 'peerjs'
const TRAINER_ID = 'isooko-live-wstest'

const wsPath = process.argv[2] || '/peerjs/peerjs'
const log = (...a) => console.log(...a)
const token = () => randomBytes(6).toString('hex')

let trainerUp = false
let viewerGotOffer = false
let trainerGotOpen = false

function connect(id, label, onOpen) {
  const url = `ws://localhost:3001${wsPath}?key=${KEY}&id=${encodeURIComponent(id)}&token=${token()}&version=${CLIENT_VERSION}`
  const ws = new WebSocket(url)
  ws.on('open', () => onOpen(ws))
  ws.on('error', e => log(`${label} ERROR`, e.message))
  ws.on('close', (code) => log(`${label} closed (code ${code})`))
  ws.on('message', data => {
    let msg
    try { msg = JSON.parse(data.toString()) } catch { return }
    if (msg.type === 'OPEN') log(`${label} <- server OPEN (registered)`)
    if (msg.type === 'ERROR') log(`${label} <- server ERROR`, JSON.stringify(msg.payload))
  })
  log(`${label} socket created at ${url.replace(/token=[^&]+/, 'token=***')}`)
  return ws
}

const trainer = connect(TRAINER_ID, 'TRAINER', ws => {
  trainerUp = true
  log('TRAINER connected, id =', TRAINER_ID)
  setTimeout(step, 300)
})

function step() {
  if (!trainerUp) return
  const viewerId = 'viewer-' + Date.now()

  const viewer = connect(viewerId, 'VIEWER', ws => {
    setTimeout(() => {
      log('VIEWER sending OFFER ->', TRAINER_ID)
      ws.send(JSON.stringify({
        type: 'OFFER', src: viewerId, dst: TRAINER_ID,
        payload: { sdp: { type: 'offer', sdp: 'v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\n' } },
      }))
    }, 500)
  })

  // Trainer listens: this is the call that never fired, showing "0 watching".
  trainer.on('message', data => {
    let msg
    try { msg = JSON.parse(data.toString()) } catch { return }
    if (msg.type === 'OFFER' && msg.dst === TRAINER_ID) {
      viewerGotOffer = true
      log('TRAINER received OFFER from', msg.src, '<-- member call reached the trainer')
      trainer.send(JSON.stringify({
        type: 'ANSWER', src: TRAINER_ID, dst: viewerId,
        payload: { sdp: { type: 'answer', sdp: 'v=0\r\no=- 2 2 IN IP4 127.0.0.1\r\n' } },
      }))
      log('TRAINER sent ANSWER ->', viewerId)
    }
  })

  setTimeout(() => {
    log(viewerGotOffer
      ? 'RESULT: PASS - offer reached the trainer through our own signaling server'
      : 'RESULT: FAIL - offer never arrived (this is the "0 watching" symptom)')
    process.exit(viewerGotOffer ? 0 : 1)
  }, 5000)
}
