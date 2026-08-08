import { createClient } from '@supabase/supabase-js'
import { readFile, writeFile, mkdir, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

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

async function getFromSupabase<T>(collection: string): Promise<T[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from(collection).select('*')
  if (error) throw error
  return (data ?? []) as T[]
}

async function saveToSupabase<T>(collection: string, data: T[]) {
  if (!supabase) return
  const { error } = await supabase.from(collection).upsert(data as Record<string, unknown>[], { onConflict: 'id' })
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
      return (data as T | null) ?? null
    } catch {
      const entries = await readJsonCollection<T>(collection)
      return entries.find(entry => entry.id === id) || null
    }
  }
  const entries = await readJsonCollection<T>(collection)
  return entries.find(entry => entry.id === id) || null
}

export async function createOne(collection: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const entry = {
    id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data: created, error } = await supabase.from(collection).insert(entry).select().single()
      if (error) throw error
      return created as Record<string, unknown>
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
      const { data: result, error } = await supabase.from(collection).update(updated).eq('id', id).select().single()
      if (error) throw error
      return result as Record<string, unknown>
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
  const entry = {
    id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...(data as object),
    createdAt: new Date().toISOString(),
  }

  if (supabase) {
    try {
      const { data: created, error } = await supabase.from(collection).insert(entry).select().single()
      if (error) throw error
      return created
    } catch {
      // fall through to JSON fallback
    }
  }

  const entries = await readJsonCollection<Record<string, unknown>>(collection)
  entries.push(entry)
  await writeJsonCollection(collection, entries)
  return entry
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
