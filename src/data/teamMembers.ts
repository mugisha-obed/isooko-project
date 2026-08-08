export interface TeamMember {
  id: string
  name: string
  roleKey: string
  photo: string
  quote?: string
}

export const teamMembers: TeamMember[] = [
  {
    id: 'tm1',
    name: 'Darlène Laure Karamutsa',
    roleKey: 'team.roleEd',
    photo: '/assets/team/team-3.webp',
    quote: 'team.edQuote',
  },
]
