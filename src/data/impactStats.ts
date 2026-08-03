export interface ImpactStat {
  id: string
  value: number
  suffix: string
  labelKey: string
}

export const impactStats: ImpactStat[] = [
  { id: 'beneficiaries', value: 11971, suffix: '+', labelKey: 'stats.beneficiaries' },
  { id: 'women',         value: 60,    suffix: '%', labelKey: 'stats.women' },
  { id: 'youth',         value: 52,    suffix: '%', labelKey: 'stats.youth' },
  { id: 'ecd',           value: 150,   suffix: '+', labelKey: 'stats.ecd' },
  { id: 'businesses',    value: 239,   suffix: '',  labelKey: 'stats.businesses' },
  { id: 'wellness',      value: 1972,  suffix: '+', labelKey: 'stats.wellness' },
]
