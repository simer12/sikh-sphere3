import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AkaalOriginalEpisode, AkaalOriginalSeason } from '../data/akaalOriginals';
import { useAkaalOriginals } from '../contexts/AkaalOriginalsContext';

interface EpisodeCardProps {
  episode: AkaalOriginalEpisode;
  onPress: () => void;
  compact?: boolean;
}

interface SeasonCardProps {
  season: AkaalOriginalSeason;
  onPress: () => void;
}

export const EpisodePosterCard: React.FC<EpisodeCardProps> = ({ episode, onPress, compact }) => {
  const { getEpisodeProgress } = useAkaalOriginals();
  const progress = getEpisodeProgress(episode.id);
  const progressPercent = progress ? progress.watchedSeconds / Math.max(progress.durationSeconds, 1) : 0;

  return (
    <TouchableOpacity style={[styles.episodeCard, compact && styles.compactEpisodeCard]} onPress={onPress}>
      <ImageBackground source={{ uri: episode.thumbnailUrl }} style={styles.poster} imageStyle={styles.posterImage}>
        <View style={styles.posterShade}>
          <View style={styles.playCircle}>
            <Ionicons name="play" size={16} color="#fff" />
          </View>
          <Text style={styles.duration}>{episode.durationMinutes} min</Text>
        </View>
        {progressPercent > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(progressPercent * 100, 100)}%` }]} />
          </View>
        )}
      </ImageBackground>
      <Text style={styles.episodeMeta}>Episode {episode.episodeNumber}</Text>
      <Text style={styles.episodeTitle} numberOfLines={2}>{episode.title}</Text>
    </TouchableOpacity>
  );
};

export const SeasonPosterCard: React.FC<SeasonCardProps> = ({ season, onPress }) => {
  const { getSeasonProgress } = useAkaalOriginals();
  const seasonProgress = getSeasonProgress(season.id);

  return (
    <TouchableOpacity style={styles.seasonCard} onPress={onPress}>
      <ImageBackground source={{ uri: season.thumbnailUrl }} style={styles.seasonPoster} imageStyle={styles.posterImage}>
        <View style={styles.seasonShade}>
          <Text style={styles.seasonNumber}>Season {season.seasonNumber}</Text>
          <Text style={styles.seasonTitle} numberOfLines={2}>{season.title}</Text>
        </View>
        {seasonProgress > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(seasonProgress * 100)}%` }]} />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  episodeCard: {
    width: 176,
    marginRight: 14,
  },
  compactEpisodeCard: {
    width: 148,
  },
  poster: {
    height: 102,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
  },
  posterImage: {
    borderRadius: 8,
  },
  posterShade: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.22)',
    padding: 10,
    justifyContent: 'space-between',
  },
  playCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,153,51,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    alignSelf: 'flex-end',
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF9933',
  },
  episodeMeta: {
    marginTop: 8,
    color: '#FFB366',
    fontSize: 11,
    fontWeight: '800',
  },
  episodeTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 3,
  },
  seasonCard: {
    width: 214,
    marginRight: 14,
  },
  seasonPoster: {
    height: 122,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
  },
  seasonShade: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.36)',
  },
  seasonNumber: {
    color: '#FFB366',
    fontSize: 12,
    fontWeight: '800',
  },
  seasonTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 4,
  },
});
