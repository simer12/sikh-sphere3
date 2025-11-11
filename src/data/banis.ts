// Bani Data Types - Using e-book/Gutka Sahib continuous text format
// Data is now loaded from BaniDB API - no static fallback

export interface Bani {
  id: number;
  name: string;
  nameGurmukhi: string;
  description: string;
  time: string;
  duration: string;
  audioUrl?: string;
  gurmukhi: string;
  transliteration: string;
  english: string;
  hindi: string;
  punjabi: string;
}

// Nitnem Bani metadata (actual content loaded from API)
// BaniDB IDs: Use correct IDs for complete Nitnem Banis
export const nitnemBanisMetadata = [
  {
    id: 2, // Japji Sahib (complete)
    name: 'Japji Sahib',
    nameGurmukhi: 'ਜਪੁਜੀ ਸਾਹਿਬ',
    description: 'The first Bani in Guru Granth Sahib, composed by Guru Nanak Dev Ji. Foundation of Sikh philosophy.',
    time: 'Morning (Amrit Vela)',
    duration: '15-20 minutes',
  },
  {
    id: 4, // Jaap Sahib (complete)
    name: 'Jaap Sahib',
    nameGurmukhi: 'ਜਾਪੁ ਸਾਹਿਬ',
    description: 'Composed by Guru Gobind Singh Ji. Describes 199 attributes of the Divine.',
    time: 'Morning',
    duration: '10-15 minutes',
  },
  {
    id: 5, // Tva Prasad Savaiye
    name: 'Tva Prasad Savaiye',
    nameGurmukhi: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵਈਏ',
    description: 'Composed by Guru Gobind Singh Ji. Praises the Divine and seeks blessings.',
    time: 'Morning',
    duration: '5 minutes',
  },
  {
    id: 6, // Chaupai Sahib
    name: 'Chaupai Sahib',
    nameGurmukhi: 'ਚੌਪਈ ਸਾਹਿਬ',
    description: 'Composed by Guru Gobind Singh Ji. Prayer for protection and courage.',
    time: 'Morning/Evening',
    duration: '5-10 minutes',
  },
  {
    id: 7, // Anand Sahib (6 pauris)
    name: 'Anand Sahib',
    nameGurmukhi: 'ਅਨੰਦੁ ਸਾਹਿਬ',
    description: 'Composed by Guru Amar Das Ji. The Song of Bliss expressing spiritual joy.',
    time: 'Morning',
    duration: '10 minutes',
  },
  {
    id: 8, // Rehras Sahib
    name: 'Rehras Sahib',
    nameGurmukhi: 'ਰਹਿਰਾਸ ਸਾਹਿਬ',
    description: 'Evening prayer to thank Waheguru for the day. Includes hymns from multiple Gurus.',
    time: 'Evening',
    duration: '15-20 minutes',
  },
  {
    id: 9, // Kirtan Sohila
    name: 'Kirtan Sohila',
    nameGurmukhi: 'ਕੀਰਤਨ ਸੋਹਿਲਾ',
    description: 'Bedtime prayer composed by multiple Gurus. Brings peace before sleep.',
    time: 'Night (Before Sleep)',
    duration: '5-10 minutes',
  },
];

// Empty array - all content loaded from BaniDB API
export const nitnemBanis: Bani[] = [];

// Legacy exports for other screens
export const gurus = [
  {
    id: '1',
    name: 'Guru Nanak Dev Ji',
    nameGurmukhi: 'ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
    period: '1469-1539',
    birthPlace: 'Nankana Sahib',
    gurushipPeriod: '1469-1539',
    description: 'Founder of Sikhism',
    teachings: ['Ik Onkar'],
    keyEvents: ['Born 1469'],
  },
];

export const dailyQuotes = [
  {
    gurmukhi: 'ਨਾਨਕ ਨਾਮ ਚੜ੍ਹਦੀ ਕਲਾ',
    transliteration: 'Nanak naam charhdi kalaa',
    english: 'With Naam comes eternal optimism',
    reference: 'Sikh Prayer',
  },
];

export const sikhConcepts = [
  {
    id: '1',
    title: 'Ik Onkar',
    titleGurmukhi: 'ੴ',
    description: 'One Universal Creator God',
    details: 'The fundamental belief in Sikhism',
  },
];
