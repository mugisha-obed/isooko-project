import { createClient } from '@supabase/supabase-js'
import { programs } from '../src/data/programs'
import { events } from '../src/data/events'
import { blogPosts } from '../src/data/blogPosts'
import { teamMembers } from '../src/data/teamMembers'
import { galleryImages } from '../src/data/galleryImages'
import { impactStats } from '../src/data/impactStats'
import { testimonials } from '../src/data/testimonials'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)
const now = new Date().toISOString()

const deflate = (row: Record<string, unknown>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]))

const collections: { name: string; rows: Record<string, unknown>[] }[] = [
  { name: 'programs', rows: programs as unknown as Record<string, unknown>[] },
  { name: 'events', rows: events as unknown as Record<string, unknown>[] },
  { name: 'blog_posts', rows: blogPosts as unknown as Record<string, unknown>[] },
  { name: 'team_members', rows: teamMembers as unknown as Record<string, unknown>[] },
  { name: 'gallery_images', rows: galleryImages as unknown as Record<string, unknown>[] },
  { name: 'impact_stats', rows: impactStats as unknown as Record<string, unknown>[] },
  { name: 'testimonials', rows: testimonials as unknown as Record<string, unknown>[] },
]

let failed = false

for (const collection of collections) {
  const rows = collection.rows.map(r =>
    deflate({
      ...r,
      id: (r.id ?? r.slug ?? '') as string,
      createdAt: now,
      updatedAt: now,
    })
  )
  const { error } = await supabase.from(collection.name).upsert(rows, { onConflict: 'id' })
  if (error) {
    failed = true
    console.error(`FAILED ${collection.name}: ${error.message}`)
  } else {
    console.log(`OK ${collection.name}: ${rows.length} rows`)
  }
}

process.exit(failed ? 1 : 0)
