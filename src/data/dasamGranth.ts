// Dasam Granth Data
// Content downloaded from BaniDB API and stored as JSON files

export interface DasamGranthBani {
  id: number;
  name: string;
  nameGurmukhi: string;
  description: string;
  verses: number;
}

// Dasam Granth Banis available in the app
// These match the JSON files in src/data/dasamGranthContent/
export const dasamGranthBanis: DasamGranthBani[] = [
  {
    id: 4,
    name: 'Jaap Sahib',
    nameGurmukhi: 'ਜਾਪੁ ਸਾਹਿਬ',
    description: 'Composed by Guru Gobind Singh Ji. Verses describing the attributes of Waheguru.',
    verses: 808,
  },
  {
    id: 28,
    name: 'Akal Ustat',
    nameGurmukhi: 'ਅਕਾਲ ਉਸਤਤ',
    description: 'Praise of the Timeless One. A beautiful composition by Guru Gobind Singh Ji.',
    verses: 54,
  },
  {
    id: 5,
    name: 'Tav Prasad Savaiye',
    nameGurmukhi: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ',
    description: 'Savaiye by the Grace of the Lord. Part of daily Nitnem.',
    verses: 89,
  },
  {
    id: 6,
    name: 'Chaupai Sahib',
    nameGurmukhi: 'ਚੌਪਈ ਸਾਹਿਬ',
    description: 'Protector from enemies and negative forces. Part of daily Nitnem.',
    verses: 43,
  },
  {
    id: 3,
    name: 'Shabd Hazare',
    nameGurmukhi: 'ਸ਼ਬਦ ਹਜ਼ਾਰੇ',
    description: 'Ten Shabads in various Ragas by Guru Gobind Singh Ji.',
    verses: 106,
  },
  {
    id: 12,
    name: 'Ath Chandi Charitar',
    nameGurmukhi: 'ਅਠ ਚੰਡੀ ਚਰਿਤ੍ਰ',
    description: 'Character of Chandi - describing the battle between good and evil.',
    verses: 26,
  },
  {
    id: 13,
    name: 'Chandi Di Vaar',
    nameGurmukhi: 'ਚੰਡੀ ਦੀ ਵਾਰ',
    description: 'Ballad of Chandi. Popularly recited composition describing valor and righteousness.',
    verses: 357,
  },
  {
    id: 19,
    name: 'Shastar Naam Mala',
    nameGurmukhi: 'ਸ਼ਸਤਰ ਨਾਮ ਮਾਲਾ',
    description: 'Rosary of Names of Weapons. Description of various weapons and their significance.',
    verses: 61,
  },
];

// Total verses available
export const DASAM_GRANTH_TOTAL_VERSES = dasamGranthBanis.reduce((sum, bani) => sum + bani.verses, 0);
