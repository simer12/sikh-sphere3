import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { useAuth } from './AuthContext';
import {
  AkaalOriginalEpisode,
  AkaalOriginalProgress,
  AkaalOriginalSeason,
  defaultAkaalOriginalEpisodes,
  defaultAkaalOriginalSeasons,
  extractYoutubeVideoId,
  getYoutubeThumbnail,
} from '../data/akaalOriginals';

interface AkaalOriginalsContextType {
  loading: boolean;
  seasons: AkaalOriginalSeason[];
  episodes: AkaalOriginalEpisode[];
  progress: Record<string, AkaalOriginalProgress>;
  publishedSeasons: AkaalOriginalSeason[];
  publishedEpisodes: AkaalOriginalEpisode[];
  getSeason: (seasonId: string) => AkaalOriginalSeason | undefined;
  getEpisode: (episodeId: string) => AkaalOriginalEpisode | undefined;
  getSeasonEpisodes: (seasonId: string, includeUnpublished?: boolean) => AkaalOriginalEpisode[];
  getContinueWatching: () => AkaalOriginalEpisode[];
  getRecentlyAdded: () => AkaalOriginalEpisode[];
  getTrendingEpisodes: () => AkaalOriginalEpisode[];
  getTrendingSeasons: () => AkaalOriginalSeason[];
  getSeasonProgress: (seasonId: string) => number;
  getEpisodeProgress: (episodeId: string) => AkaalOriginalProgress | undefined;
  markEpisodeProgress: (episodeId: string, watchedSeconds?: number, completed?: boolean) => Promise<void>;
  addSeason: (season: Partial<AkaalOriginalSeason>) => Promise<void>;
  addEpisode: (episode: Partial<AkaalOriginalEpisode>) => Promise<void>;
  updateEpisode: (episodeId: string, updates: Partial<AkaalOriginalEpisode>) => Promise<void>;
  updateSeason: (seasonId: string, updates: Partial<AkaalOriginalSeason>) => Promise<void>;
  deleteEpisode: (episodeId: string) => Promise<void>;
  deleteSeason: (seasonId: string) => Promise<void>;
  resetLibrary: () => Promise<void>;
}

const STORAGE_KEY = 'akaal_originals_library_v1';
const PROGRESS_KEY = 'akaal_originals_progress_v1';

const AkaalOriginalsContext = createContext<AkaalOriginalsContextType>({} as AkaalOriginalsContextType);

const parseList = (value?: string | string[]) => {
  if (Array.isArray(value)) return value;
  return (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

// Database mapping helper functions
const mapSeasonFromDB = (dbSeason: any): AkaalOriginalSeason => ({
  id: dbSeason.id,
  title: dbSeason.title,
  subtitle: dbSeason.subtitle || '',
  description: dbSeason.description || '',
  seasonNumber: dbSeason.season_number,
  thumbnailUrl: dbSeason.thumbnail_url,
  trailerYoutubeUrl: dbSeason.trailer_youtube_url || '',
  featured: dbSeason.featured,
  trending: dbSeason.trending,
  published: dbSeason.published,
  createdAt: dbSeason.created_at,
  updatedAt: dbSeason.updated_at,
});

const mapSeasonToDB = (season: AkaalOriginalSeason) => ({
  id: season.id,
  title: season.title,
  subtitle: season.subtitle,
  description: season.description,
  season_number: season.seasonNumber,
  thumbnail_url: season.thumbnailUrl,
  trailer_youtube_url: season.trailerYoutubeUrl,
  featured: season.featured,
  trending: season.trending,
  published: season.published,
});

const mapEpisodeFromDB = (dbEpisode: any): AkaalOriginalEpisode => ({
  id: dbEpisode.id,
  seasonId: dbEpisode.season_id,
  episodeNumber: dbEpisode.episode_number,
  title: dbEpisode.title,
  description: dbEpisode.description || '',
  youtubeUrl: dbEpisode.youtube_url,
  youtubeVideoId: dbEpisode.youtube_video_id,
  thumbnailUrl: dbEpisode.thumbnail_url,
  durationMinutes: dbEpisode.duration_minutes,
  importantPeople: dbEpisode.important_people || [],
  locations: dbEpisode.locations || [],
  timelineLabel: dbEpisode.timeline_label || '',
  references: dbEpisode.source_references || [],
  tags: dbEpisode.tags || [],
  category: dbEpisode.category,
  featured: dbEpisode.featured,
  trending: dbEpisode.trending,
  published: dbEpisode.published,
  createdAt: dbEpisode.created_at,
  updatedAt: dbEpisode.updated_at,
});

const mapEpisodeToDB = (episode: AkaalOriginalEpisode) => ({
  id: episode.id,
  season_id: episode.seasonId,
  episode_number: episode.episodeNumber,
  title: episode.title,
  description: episode.description,
  youtube_url: episode.youtubeUrl,
  youtube_video_id: episode.youtubeVideoId,
  thumbnail_url: episode.thumbnailUrl,
  duration_minutes: Math.round(episode.durationMinutes),
  important_people: episode.importantPeople,
  locations: episode.locations,
  timeline_label: episode.timelineLabel,
  source_references: episode.references,
  tags: episode.tags,
  category: episode.category,
  featured: episode.featured,
  trending: episode.trending,
  published: episode.published,
});

export const useAkaalOriginals = () => {
  const context = useContext(AkaalOriginalsContext);
  if (!context) {
    throw new Error('useAkaalOriginals must be used within an AkaalOriginalsProvider');
  }
  return context;
};

export const AkaalOriginalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [seasons, setSeasons] = useState<AkaalOriginalSeason[]>(defaultAkaalOriginalSeasons);
  const [episodes, setEpisodes] = useState<AkaalOriginalEpisode[]>(defaultAkaalOriginalEpisodes);
  const [progress, setProgress] = useState<Record<string, AkaalOriginalProgress>>({});

  const loadUserProgress = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('akaal_episode_progress')
        .select('*')
        .eq('user_id', uid);

      if (error) throw error;

      if (data && data.length > 0) {
        const syncedProgress: Record<string, AkaalOriginalProgress> = {};
        data.forEach((row: any) => {
          syncedProgress[row.episode_id] = {
            episodeId: row.episode_id,
            seasonId: episodes.find((e) => e.id === row.episode_id)?.seasonId || '',
            watchedSeconds: row.watched_seconds,
            durationSeconds: row.duration_seconds,
            completed: row.completed,
            lastWatchedAt: row.last_watched_at || row.updated_at,
          };
        });

        // Merge with local progress, prioritizing newer timestamps
        const localCached = await AsyncStorage.getItem(PROGRESS_KEY);
        const local = localCached ? JSON.parse(localCached) : {};
        const merged = { ...local };

        Object.keys(syncedProgress).forEach((epId) => {
          const localEp = local[epId];
          const cloudEp = syncedProgress[epId];
          if (!localEp || new Date(cloudEp.lastWatchedAt) > new Date(localEp.lastWatchedAt)) {
            merged[epId] = cloudEp;
          }
        });

        setProgress(merged);
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(merged));
      }
    } catch (err: any) {
      console.log('Using offline progress cache. (Cloud progress sync bypassed or table not created yet):', err.message);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  useEffect(() => {
    if (user && episodes.length > 0) {
      loadUserProgress(user.uid);
    } else if (!user) {
      // Clear progress or fallback to standard cache when logging out
      AsyncStorage.getItem(PROGRESS_KEY).then((cached) => {
        setProgress(cached ? JSON.parse(cached) : {});
      });
    }
  }, [user, episodes.length]);

  const persistLibrary = async (nextSeasons: AkaalOriginalSeason[], nextEpisodes: AkaalOriginalEpisode[]) => {
    setSeasons(nextSeasons);
    setEpisodes(nextEpisodes);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ seasons: nextSeasons, episodes: nextEpisodes }));
  };

  const persistProgress = async (nextProgress: Record<string, AkaalOriginalProgress>) => {
    setProgress(nextProgress);
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(nextProgress));
  };

  const loadLibrary = async () => {
    try {
      // 1. Load watch progress and local library cache first (for instant offline launch)
      const storedLibrary = await AsyncStorage.getItem(STORAGE_KEY);
      const storedProgress = await AsyncStorage.getItem(PROGRESS_KEY);

      if (storedLibrary) {
        const parsed = JSON.parse(storedLibrary);
        if (Array.isArray(parsed.seasons)) setSeasons(parsed.seasons);
        if (Array.isArray(parsed.episodes)) setEpisodes(parsed.episodes);
      }

      if (storedProgress) {
        setProgress(JSON.parse(storedProgress));
      }

      // 2. Fetch fresh catalog from Supabase in the background
      const [seasonsRes, episodesRes] = await Promise.all([
        supabase.from('akaal_seasons').select('*').order('season_number', { ascending: true }),
        supabase.from('akaal_episodes').select('*').order('episode_number', { ascending: true })
      ]);

      if (seasonsRes.error) throw seasonsRes.error;
      if (episodesRes.error) throw episodesRes.error;

      if (seasonsRes.data && episodesRes.data) {
        const freshSeasons = seasonsRes.data.map(mapSeasonFromDB);
        const freshEpisodes = episodesRes.data.map(mapEpisodeFromDB);

        setSeasons(freshSeasons);
        setEpisodes(freshEpisodes);

        // Cache the latest schema locally for offline launches
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ seasons: freshSeasons, episodes: freshEpisodes })
        );
      }
    } catch (error) {
      console.log('Using offline local cache for Akaal Originals catalog. (Supabase fetch bypassed or failed)');
    } finally {
      setLoading(false);
    }
  };

  const publishedSeasons = useMemo(
    () => seasons.filter((season) => season.published).sort((a, b) => a.seasonNumber - b.seasonNumber),
    [seasons]
  );

  const publishedEpisodes = useMemo(
    () => episodes.filter((episode) => episode.published).sort((a, b) => b.episodeNumber - a.episodeNumber),
    [episodes]
  );

  const getSeason = (seasonId: string) => seasons.find((season) => season.id === seasonId);
  const getEpisode = (episodeId: string) => episodes.find((episode) => episode.id === episodeId);

  const getSeasonEpisodes = (seasonId: string, includeUnpublished = false) =>
    episodes
      .filter((episode) => episode.seasonId === seasonId && (includeUnpublished || episode.published))
      .sort((a, b) => a.episodeNumber - b.episodeNumber);

  const getContinueWatching = () =>
    publishedEpisodes
      .filter((episode) => {
        const itemProgress = progress[episode.id];
        return itemProgress && itemProgress.watchedSeconds > 0 && !itemProgress.completed;
      })
      .sort((a, b) => {
        const aDate = progress[a.id]?.lastWatchedAt || '';
        const bDate = progress[b.id]?.lastWatchedAt || '';
        return bDate.localeCompare(aDate);
      });

  const getRecentlyAdded = () =>
    [...publishedEpisodes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10);

  const getTrendingEpisodes = () => publishedEpisodes.filter((episode) => episode.trending).slice(0, 10);

  const getTrendingSeasons = () => publishedSeasons.filter((season) => season.trending);

  const getEpisodeProgress = (episodeId: string) => progress[episodeId];

  const getSeasonProgress = (seasonId: string) => {
    const seasonEpisodes = getSeasonEpisodes(seasonId);
    if (seasonEpisodes.length === 0) return 0;
    const completed = seasonEpisodes.filter((episode) => progress[episode.id]?.completed).length;
    return completed / seasonEpisodes.length;
  };

  const markEpisodeProgress = async (episodeId: string, watchedSeconds = 0, completed = false) => {
    const episode = getEpisode(episodeId);
    if (!episode) return;

    const durationSeconds = episode.durationMinutes * 60;
    const finalWatchedSeconds = completed ? durationSeconds : Math.min(watchedSeconds, durationSeconds);
    const timestamp = new Date().toISOString();
    const nextProgress = {
      ...progress,
      [episodeId]: {
        episodeId,
        seasonId: episode.seasonId,
        watchedSeconds: finalWatchedSeconds,
        durationSeconds,
        completed,
        lastWatchedAt: timestamp,
      },
    };

    await persistProgress(nextProgress);

    // Sync to Supabase in the background if the user is authenticated
    if (user) {
      supabase
        .from('akaal_episode_progress')
        .upsert(
          {
            user_id: user.uid,
            episode_id: episodeId,
            watched_seconds: finalWatchedSeconds,
            duration_seconds: durationSeconds,
            completed,
            last_watched_at: timestamp,
          },
          { onConflict: 'user_id,episode_id' }
        )
        .then(({ error }) => {
          if (error) {
            console.log('Failed to sync progress to Supabase (offline fallback active):', error.message);
          }
        });
    }
  };

  const addSeason = async (season: Partial<AkaalOriginalSeason>) => {
    const timestamp = new Date().toISOString();
    const nextSeason: AkaalOriginalSeason = {
      id: `season-${Date.now()}`,
      title: season.title || 'Untitled Season',
      subtitle: season.subtitle || '',
      description: season.description || '',
      seasonNumber: season.seasonNumber || seasons.length + 1,
      thumbnailUrl: season.thumbnailUrl || getYoutubeThumbnail('dQw4w9WgXcQ'),
      trailerYoutubeUrl: season.trailerYoutubeUrl || '',
      featured: Boolean(season.featured),
      trending: Boolean(season.trending),
      published: season.published ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      const { error } = await supabase
        .from('akaal_seasons')
        .insert(mapSeasonToDB(nextSeason));

      if (error) throw error;

      await persistLibrary([...seasons, nextSeason], episodes);
    } catch (err) {
      console.error('Error saving season to Supabase:', err);
      throw err;
    }
  };

  const addEpisode = async (episode: Partial<AkaalOriginalEpisode>) => {
    const timestamp = new Date().toISOString();
    const youtubeUrl = episode.youtubeUrl || '';
    const youtubeVideoId = episode.youtubeVideoId || extractYoutubeVideoId(youtubeUrl);
    const targetSeasonId = episode.seasonId || seasons[0]?.id || 'season-1';
    const seasonEpisodes = episodes.filter((ep) => ep.seasonId === targetSeasonId);
    const nextEpisode: AkaalOriginalEpisode = {
      id: `episode-${Date.now()}`,
      seasonId: targetSeasonId,
      episodeNumber: episode.episodeNumber || (seasonEpisodes.length + 1),
      title: episode.title || 'Untitled Episode',
      description: episode.description || '',
      youtubeUrl,
      youtubeVideoId,
      thumbnailUrl: episode.thumbnailUrl || getYoutubeThumbnail(youtubeVideoId),
      durationMinutes: episode.durationMinutes || 30,
      importantPeople: parseList(episode.importantPeople),
      locations: parseList(episode.locations),
      timelineLabel: episode.timelineLabel || '',
      references: parseList(episode.references),
      tags: parseList(episode.tags),
      category: episode.category || 'history',
      featured: Boolean(episode.featured),
      trending: Boolean(episode.trending),
      published: episode.published ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    try {
      const { error } = await supabase
        .from('akaal_episodes')
        .insert(mapEpisodeToDB(nextEpisode));

      if (error) throw error;

      await persistLibrary(seasons, [...episodes, nextEpisode]);
    } catch (err) {
      console.error('Error saving episode to Supabase:', err);
      throw err;
    }
  };

  const updateEpisode = async (episodeId: string, updates: Partial<AkaalOriginalEpisode>) => {
    const original = getEpisode(episodeId);
    if (!original) return;

    const youtubeUrl = updates.youtubeUrl ?? original.youtubeUrl;
    const youtubeVideoId = updates.youtubeVideoId || extractYoutubeVideoId(youtubeUrl);
    
    const updated: AkaalOriginalEpisode = {
      ...original,
      ...updates,
      youtubeVideoId,
      thumbnailUrl: updates.thumbnailUrl || original.thumbnailUrl || getYoutubeThumbnail(youtubeVideoId),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('akaal_episodes')
        .update(mapEpisodeToDB(updated))
        .eq('id', episodeId);

      if (error) throw error;

      const nextEpisodes = episodes.map((item) => (item.id === episodeId ? updated : item));
      await persistLibrary(seasons, nextEpisodes);
    } catch (err) {
      console.error('Error updating episode in Supabase:', err);
      throw err;
    }
  };

  const updateSeason = async (seasonId: string, updates: Partial<AkaalOriginalSeason>) => {
    const original = getSeason(seasonId);
    if (!original) return;

    const updated: AkaalOriginalSeason = {
      ...original,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('akaal_seasons')
        .update(mapSeasonToDB(updated))
        .eq('id', seasonId);

      if (error) throw error;

      const nextSeasons = seasons.map((item) => (item.id === seasonId ? updated : item));
      await persistLibrary(nextSeasons, episodes);
    } catch (err) {
      console.error('Error updating season in Supabase:', err);
      throw err;
    }
  };

  const deleteEpisode = async (episodeId: string) => {
    try {
      const { error } = await supabase
        .from('akaal_episodes')
        .delete()
        .eq('id', episodeId);

      if (error) throw error;

      const nextEpisodes = episodes.filter((item) => item.id !== episodeId);
      await persistLibrary(seasons, nextEpisodes);
    } catch (err) {
      console.error('Error deleting episode from Supabase:', err);
      throw err;
    }
  };

  const deleteSeason = async (seasonId: string) => {
    try {
      const { error } = await supabase
        .from('akaal_seasons')
        .delete()
        .eq('id', seasonId);

      if (error) throw error;

      // Filter locally because DB cascade deletes them, so we sync local state
      const nextSeasons = seasons.filter((item) => item.id !== seasonId);
      const nextEpisodes = episodes.filter((item) => item.seasonId !== seasonId);
      await persistLibrary(nextSeasons, nextEpisodes);
    } catch (err) {
      console.error('Error deleting season from Supabase:', err);
      throw err;
    }
  };

  const resetLibrary = async () => {
    await persistProgress({});
    await loadLibrary();
  };

  const value = {
    loading,
    seasons,
    episodes,
    progress,
    publishedSeasons,
    publishedEpisodes,
    getSeason,
    getEpisode,
    getSeasonEpisodes,
    getContinueWatching,
    getRecentlyAdded,
    getTrendingEpisodes,
    getTrendingSeasons,
    getSeasonProgress,
    getEpisodeProgress,
    markEpisodeProgress,
    addSeason,
    addEpisode,
    updateEpisode,
    updateSeason,
    deleteEpisode,
    deleteSeason,
    resetLibrary,
  };

  return <AkaalOriginalsContext.Provider value={value}>{children}</AkaalOriginalsContext.Provider>;
};
