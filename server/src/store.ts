import { writeFile, readFile, mkdir, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, '..', 'data')

async function ensureDataDir() {
  try {
    await access(DATA_DIR)
  } catch {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

async function readCollection<T>(collection: string): Promise<T[]> {
  await ensureDataDir()
  const filePath = join(DATA_DIR, `${collection}.json`)
  try {
    const raw = await readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeCollection<T>(collection: string, data: T[]) {
  await ensureDataDir()
  const filePath = join(DATA_DIR, `${collection}.json`)
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function saveSubmission(collection: string, data: unknown) {
  const entries = await readCollection(collection)
  const entry = {
    id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...(data as object),
    createdAt: new Date().toISOString(),
  }
  entries.push(entry)
  await writeCollection(collection, entries)
  return entry
}

export async function getAll<T>(collection: string): Promise<T[]> {
  return readCollection<T>(collection)
}

export async function getById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
  const entries = await readCollection<T>(collection)
  return entries.find(e => e.id === id) || null
}

export async function createOne(collection: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
  const entries = await readCollection(collection)
  const entry = {
    id: `${collection}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  entries.push(entry)
  await writeCollection(collection, entries)
  return entry
}

export async function updateOne(collection: string, id: string, data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
  const entries = await readCollection<Record<string, unknown>>(collection)
  const idx = entries.findIndex(e => e.id === id)
  if (idx === -1) return null
  entries[idx] = { ...entries[idx], ...data, id, updatedAt: new Date().toISOString() }
  await writeCollection(collection, entries)
  return entries[idx]
}

export async function deleteOne(collection: string, id: string): Promise<boolean> {
  const entries = await readCollection<Record<string, unknown>>(collection)
  const idx = entries.findIndex(e => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  await writeCollection(collection, entries)
  return true
}

export async function upsertAll<T>(collection: string, data: T[]): Promise<T[]> {
  await writeCollection(collection, data)
  return data
}
