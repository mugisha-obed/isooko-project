export interface TeamMember {
  id: string
  name: string
  roleKey: string
  photo: string
}

export const teamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Uwimana Chantal',      roleKey: 'team.role1', photo: '/assets/team/team-placeholder.svg' },
  { id: 'tm2', name: 'Nkurunziza Jean-Paul', roleKey: 'team.role2', photo: '/assets/team/team-placeholder.svg' },
  { id: 'tm3', name: 'Mukamana Diane',       roleKey: 'team.role3', photo: '/assets/team/team-placeholder.svg' },
]
