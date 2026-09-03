import { createClient } from '@supabase/supabase-js'
import { readFile, writeFile, mkdir, access } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function resolveDataDir(): string {
  const candidates = [
    join(__dirname, '..', 'data'),
    join(process.cwd(), 'server', 'data'),
  ]
  for (const dir of candidates) {
    if (existsSync(dir)) return dir
  }
  return candidates[0]
}

const DATA_DIR = resolveDataDir()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

async function ensureDataDir() {
  try {
    await access(DATA_DIR)
  } catch {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

async function readJsonCollection<T>(collection: string): Promise<T[]> {
  await ensureDataDir()
  const filePath = join(DATA_DIR, `${collection}.json`)
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

async function writeJsonCollection<T>(collection: string, data: T[]) {
  await ensureDataDir()
  const filePath = join(DATA_DIR, `${collection}.json`)
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

const FIELD_MAP: Record<string, string> = {
  // shared
  createdat: 'createdAt',
  updatedat: 'updatedAt',
  // auth
  passwordhash: 'passwordHash',
  // programs
  titlekey: 'titleKey',
  subtitlekey: 'subtitleKey',
  desckey: 'descKey',
  offeringskey: 'offeringsKey',
  // events
  locationkey: 'locationKey',
  // blog posts
  excerptkey: 'excerptKey',
  contentkey: 'contentKey',
  featuredimage: 'featuredImage',
  // team
  rolekey: 'roleKey',
  // gallery
  altkey: 'altKey',
  // impact
  labelkey: 'labelKey',
  // testimonials
  quotekey: 'quoteKey',
  // volunteers
  areaofinterest: 'areaOfInterest',
  // employees
  employeeid: 'employeeId',
  taxid: 'taxId',
  startdate: 'startDate',
  // attendance
  checkin: 'checkIn',
  checkout: 'checkOut',
  latitude: 'latitude',
  longitude: 'longitude',
  locationlabel: 'locationLabel',
  // leave
  enddate: 'endDate',
}

function normalizeRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    const normalized = FIELD_MAP[key] ?? key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    out[normalized] = value
  }
  return out
}

function deflateRow(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(row)) {
    out[key.toLowerCase()] = value
  }
  return out
}

async function getFromSupabase<T>(collection: string): Promise<T[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from(collection).select('*')
  if (error) throw error
  return ((data ?? []) as Record<string, unknown>[]).map(normalizeRow) as T[]
}

async function saveToSupabase<T>(collection: string, data: T[]) {
  if (!supabase) return
  const rows = (data as Record<string, unknown>[]).map(deflateRow)
  const { error } = await supabase.from(collection).upsert(rows, { onConflict: 'id' })
  if (error) throw error
}

export async function getAll<T>(collection: string): Promise<T[]> {
  if (supabase) {
    try {
      return await getFromSupabase<T>(collection)
    } catch {
      return readJsonCollection<T>(collection)
    }
  }
  return readJsonCollection<T>(collection)
}

export async function getById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from(collection).select('*').eq('id', id).single()
      if (error) throw error
      return data ? (normalizeRow(data as Record<string, unknown>) as T) : null
    } catch {
      const entries = await readJsonCollection<T>(collection)
      return entries.find(entry => entry.id === id) || null
    }
  }
  const entries = await readJsonCollection<T>(collection)
  return entries.find(entry => entry.id === id) || null
}

export async function createOne(collection: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const id = typeof data.id === 'string' && data.id
    ? data.id
    : `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const { id: _dropped, ...rest } = data
  const entry = {
    id,
    ...rest,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data: created, error } = await supabase.from(collection).insert(deflateRow(entry)).select().single()
      if (error) throw error
      return normalizeRow(created as Record<string, unknown>)
    } catch {
      // fall through to JSON fallback
    }
  }

  const entries = await readJsonCollection<Record<string, unknown>>(collection)
  entries.push(entry)
  await writeJsonCollection(collection, entries)
  return entry
}

export async function updateOne(collection: string, id: string, data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const updated = {
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data: result, error } = await supabase.from(collection).update(deflateRow(updated)).eq('id', id).select().single()
      if (error) throw error
      return result ? normalizeRow(result as Record<string, unknown>) : null
    } catch {
      // fall through to JSON fallback
    }
  }

  const entries = await readJsonCollection<Record<string, unknown>>(collection)
  const idx = entries.findIndex(entry => entry.id === id)
  if (idx === -1) return null
  entries[idx] = { ...entries[idx], ...updated }
  await writeJsonCollection(collection, entries)
  return entries[idx]
}

export async function deleteOne(collection: string, id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from(collection).delete().eq('id', id)
      if (!error) return true
    } catch {
      // fall through to JSON fallback
    }
  }

  const entries = await readJsonCollection<Record<string, unknown>>(collection)
  const idx = entries.findIndex(entry => entry.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  await writeJsonCollection(collection, entries)
  return true
}

export async function saveSubmission(collection: string, data: unknown) {
  const id = typeof (data as Record<string, unknown>)?.id === 'string' && (data as Record<string, unknown>).id
    ? (data as Record<string, unknown>).id as string
    : `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const { id: _dropped, ...rest } = (data ?? {}) as Record<string, unknown>
  const entry = {
    id,
    ...rest,
    createdAt: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data: created, error } = await supabase.from(collection).insert(deflateRow(entry)).select().single()
      if (error) throw error
      return created ? normalizeRow(created as Record<string, unknown>) : created
    } catch {
      // fall through to JSON fallback
    }
  }

  const entries = await readJsonCollection<Record<string, unknown>>(collection)
  entries.push(entry)
  await writeJsonCollection(collection, entries)
  return entry
}

export async function setAdminPassword(username: string, passwordHash: string): Promise<void> {
  if (supabase) {
    try {
      const { data: updated, error } = await supabase
        .from('admins')
        .update({ passwordhash: passwordHash, updatedat: new Date().toISOString() })
        .eq('username', username)
        .select()
      if (error) throw error
      if (Array.isArray(updated) && updated.length > 0) return

      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          id: 'admin-1',
          username,
          passwordhash: passwordHash,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
        })
      if (insertError) throw insertError
      return
    } catch {
      // fall through to JSON fallback
    }
  }

  const entries = await readJsonCollection<{ id: string; username: string; passwordHash: string }>('admins')
  const idx = entries.findIndex(a => a.username === username)
  if (idx >= 0) entries[idx] = { ...entries[idx], passwordHash }
  else entries.push({ id: 'admin-1', username, passwordHash })
  await writeJsonCollection('admins', entries)
}

export async function upsertAll<T>(collection: string, data: T[]): Promise<T[]> {
  if (supabase) {
    try {
      await saveToSupabase(collection, data)
      return data
    } catch {
      // fall through to JSON fallback
    }
  }

  await writeJsonCollection(collection, data)
  return data
}
