export type AkaalOriginalCategory = 'history' | 'battle' | 'event' | 'biography' | 'map' | 'timeline';

export interface AkaalOriginalSeason {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  seasonNumber: number;
  thumbnailUrl: string;
  trailerYoutubeUrl?: string;
  featured: boolean;
  trending: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AkaalOriginalEpisode {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  durationMinutes: number;
  importantPeople: string[];
  locations: string[];
  timelineLabel: string;
  references: string[];
  tags: string[];
  category: AkaalOriginalCategory;
  featured: boolean;
  trending: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AkaalOriginalProgress {
  episodeId: string;
  seasonId: string;
  watchedSeconds: number;
  durationSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

export const extractYoutubeVideoId = (url: string): string => {
  const trimmed = url.trim();
  const patterns = [
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
    /youtube\.com\/shorts\/([^?&/]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return trimmed;
};

export const getYoutubeThumbnail = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

const now = '2026-07-05T00:00:00.000Z';

export const defaultAkaalOriginalSeasons: AkaalOriginalSeason[] = [
  {
    id: 'season-1',
    title: 'Sikh History: Foundations',
    subtitle: 'Guru Nanak Dev Ji to early Sikh institutions',
    description: 'A cinematic learning path through the roots of Sikh history, teachings, and early community formation.',
    seasonNumber: 1,
    thumbnailUrl: getYoutubeThumbnail('dQw4w9WgXcQ'),
    trailerYoutubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    featured: true,
    trending: false,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'season-2',
    title: 'The Khalsa Era',
    subtitle: 'Courage, sacrifice, and sovereignty',
    description: 'Episodes focused on Guru Gobind Singh Ji, the creation of the Khalsa, and defining moments of Sikh resilience.',
    seasonNumber: 2,
    thumbnailUrl: getYoutubeThumbnail('ysz5S6PUM-U'),
    trailerYoutubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    featured: false,
    trending: true,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'season-3',
    title: 'Battles And Turning Points',
    subtitle: 'Chamkaur, Muktsar, Anandpur Sahib',
    description: 'A focused series on major Sikh battles, important people, locations, and historical impact.',
    seasonNumber: 3,
    thumbnailUrl: getYoutubeThumbnail('jNQXAC9IVRw'),
    trailerYoutubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    featured: false,
    trending: true,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
];

export const defaultAkaalOriginalEpisodes: AkaalOriginalEpisode[] = [
  {
    id: 'episode-18',
    seasonId: 'season-2',
    episodeNumber: 18,
    title: 'The Road To Anandpur Sahib',
    description: 'The political and spiritual setting that shaped the years before the Khalsa was revealed.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    youtubeVideoId: 'ysz5S6PUM-U',
    thumbnailUrl: getYoutubeThumbnail('ysz5S6PUM-U'),
    durationMinutes: 46,
    importantPeople: ['Guru Gobind Singh Ji', 'Bhai Nand Lal Ji'],
    locations: ['Anandpur Sahib', 'Punjab'],
    timelineLabel: 'Late 1600s',
    references: ['Sikh historical tradition', 'Panth Prakash references'],
    tags: ['Khalsa', 'Anandpur Sahib', 'Guru Gobind Singh Ji'],
    category: 'history',
    featured: true,
    trending: false,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'episode-27',
    seasonId: 'season-3',
    episodeNumber: 27,
    title: 'The Battle of Chamkaur',
    description: 'A respectful retelling of the Battle of Chamkaur, its people, location, and enduring meaning.',
    youtubeUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    youtubeVideoId: 'jNQXAC9IVRw',
    thumbnailUrl: getYoutubeThumbnail('jNQXAC9IVRw'),
    durationMinutes: 52,
    importantPeople: ['Guru Gobind Singh Ji', 'Baba Ajit Singh Ji', 'Baba Jujhar Singh Ji'],
    locations: ['Chamkaur Sahib'],
    timelineLabel: '1704',
    references: ['Historical accounts of Chamkaur', 'Sikh tradition'],
    tags: ['Battle', 'Chamkaur', 'Sahibzade'],
    category: 'battle',
    featured: true,
    trending: true,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'episode-28',
    seasonId: 'season-3',
    episodeNumber: 28,
    title: 'After Chamkaur',
    description: 'What happened after Chamkaur and how the events shaped the next phase of Sikh history.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    thumbnailUrl: getYoutubeThumbnail('dQw4w9WgXcQ'),
    durationMinutes: 39,
    importantPeople: ['Guru Gobind Singh Ji', 'Mai Bhago Ji'],
    locations: ['Machhiwara', 'Muktsar'],
    timelineLabel: '1704-1705',
    references: ['Sikh historical tradition'],
    tags: ['Timeline', 'Chamkaur', 'Muktsar'],
    category: 'timeline',
    featured: false,
    trending: true,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'episode-1',
    seasonId: 'season-1',
    episodeNumber: 1,
    title: 'Guru Nanak Dev Ji: The Beginning',
    description: 'An introduction to Guru Nanak Dev Ji and the spiritual foundation of Sikh history.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeVideoId: 'dQw4w9WgXcQ',
    thumbnailUrl: getYoutubeThumbnail('dQw4w9WgXcQ'),
    durationMinutes: 34,
    importantPeople: ['Guru Nanak Dev Ji', 'Bhai Mardana Ji'],
    locations: ['Nankana Sahib', 'Sultanpur Lodhi'],
    timelineLabel: '1469 onward',
    references: ['Janamsakhi tradition', 'Sikh historical sources'],
    tags: ['Guru Nanak Dev Ji', 'Foundations', 'Biography'],
    category: 'biography',
    featured: false,
    trending: false,
    published: true,
    createdAt: now,
    updatedAt: now,
  },
];
