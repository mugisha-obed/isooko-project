export interface Program {
  id: string
  icon: string
  titleKey: string
  subtitleKey: string
  descKey: string
  offeringsKey: string
}

export const programs: Program[] = [
  {
    id: 'women-empowerment',
    icon: 'FaVenus',
    titleKey: 'womenEmpowerment.title',
    subtitleKey: 'womenEmpowerment.subtitle',
    descKey: 'womenEmpowerment.desc',
    offeringsKey: 'womenEmpowerment.offerings',
  },
  {
    id: 'youth-empowerment',
    icon: 'FaRocket',
    titleKey: 'youthEmpowerment.title',
    subtitleKey: 'youthEmpowerment.subtitle',
    descKey: 'youthEmpowerment.desc',
    offeringsKey: 'youthEmpowerment.offerings',
  },
  {
    id: 'sports-wellness',
    icon: 'FaRunning',
    titleKey: 'sportsWellness.title',
    subtitleKey: 'sportsWellness.subtitle',
    descKey: 'sportsWellness.desc',
    offeringsKey: 'sportsWellness.offerings',
  },
  {
    id: 'digital-literacy',
    icon: 'FaLaptop',
    titleKey: 'digitalLiteracy.title',
    subtitleKey: 'digitalLiteracy.subtitle',
    descKey: 'digitalLiteracy.desc',
    offeringsKey: 'digitalLiteracy.offerings',
  },
  {
    id: 'tuuza-mubyeyi',
    icon: 'FaChild',
    titleKey: 'tuuzaMubyeyi.title',
    subtitleKey: 'tuuzaMubyeyi.subtitle',
    descKey: 'tuuzaMubyeyi.desc',
    offeringsKey: 'tuuzaMubyeyi.offerings',
  },
]
