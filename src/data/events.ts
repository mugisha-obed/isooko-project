export interface CommunityEvent {
  id: string
  titleKey: string
  date: string
  time: string
  locationKey: string
  descKey: string
}

export const events: CommunityEvent[] = [
  { id: 'ev1', titleKey: 'events.yoga.title', date: '2026-08-15', time: '08:00', locationKey: 'events.yoga.location', descKey: 'events.yoga.desc' },
  { id: 'ev2', titleKey: 'events.saving.title', date: '2026-09-05', time: '10:00', locationKey: 'events.saving.location', descKey: 'events.saving.desc' },
  { id: 'ev3', titleKey: 'events.vocational.title', date: '2026-10-20', time: '09:00', locationKey: 'events.vocational.location', descKey: 'events.vocational.desc' },
]
