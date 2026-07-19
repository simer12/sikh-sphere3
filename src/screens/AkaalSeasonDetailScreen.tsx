import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAkaalOriginals } from '../contexts/AkaalOriginalsContext';

export default function AkaalSeasonDetailScreen({ route, navigation }: any) {
  const { seasonId } = route.params;
  const { getSeason, getSeasonEpisodes, getSeasonProgress, getEpisodeProgress } = useAkaalOriginals();
  const season = getSeason(seasonId);

  if (!season) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Season not found</Text>
      </View>
    );
  }

  const episodes = getSeasonEpisodes(season.id);
  const progress = getSeasonProgress(season.id);
  const nextEpisode = episodes.find((episode) => !getEpisodeProgress(episode.id)?.completed) || episodes[0];

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={{ uri: season.thumbnailUrl }} style={styles.hero} imageStyle={styles.heroImage}>
        <View style={styles.heroShade}>
          <Text style={styles.kicker}>Season {season.seasonNumber}</Text>
          <Text style={styles.title}>{season.title}</Text>
          <Text style={styles.subtitle}>{season.subtitle}</Text>
          <Text style={styles.description}>{season.description}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress * 100)}% completed</Text>
          {nextEpisode && (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => navigation.navigate('AkaalEpisodeDetail', { episodeId: nextEpisode.id })}
            >
              <Ionicons name="play" size={18} color="#111" />
              <Text style={styles.playButtonText}>Continue Season</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Episodes</Text>
        {episodes.map((episode) => {
          const itemProgress = getEpisodeProgress(episode.id);
          const completed = itemProgress?.completed;
          return (
            <TouchableOpacity
              key={episode.id}
              style={styles.episodeRow}
              onPress={() => navigation.navigate('AkaalEpisodeDetail', { episodeId: episode.id })}
            >
              <View style={styles.episodeNumber}>
                <Text style={styles.episodeNumberText}>{episode.episodeNumber}</Text>
              </View>
              <View style={styles.episodeContent}>
                <Text style={styles.episodeTitle}>{episode.title}</Text>
                <Text style={styles.episodeMeta}>{episode.durationMinutes} min • {episode.timelineLabel}</Text>
                <Text style={styles.episodeDescription} numberOfLines={2}>{episode.description}</Text>
              </View>
              <Ionicons name={completed ? 'checkmark-circle' : 'play-circle-outline'} size={26} color={completed ? '#81C784' : '#FF9933'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B' },
  empty: { flex: 1, backgroundColor: '#0B0B0B', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  hero: { minHeight: 390, justifyContent: 'flex-end', backgroundColor: '#151515' },
  heroImage: { opacity: 0.7 },
  heroShade: { flex: 1, justifyContent: 'flex-end', padding: 20, backgroundColor: 'rgba(0,0,0,0.42)' },
  kicker: { color: '#FFB366', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 8 },
  subtitle: { color: '#E0E0E0', fontSize: 15, fontWeight: '700', marginTop: 6 },
  description: { color: '#D8D8D8', fontSize: 14, lineHeight: 21, marginTop: 10 },
  progressTrack: { height: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.28)', overflow: 'hidden', marginTop: 18 },
  progressFill: { height: '100%', backgroundColor: '#FF9933' },
  progressText: { color: '#FFB366', fontSize: 12, fontWeight: '900', marginTop: 7 },
  playButton: { alignSelf: 'flex-start', marginTop: 16, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 7 },
  playButtonText: { color: '#111', fontSize: 15, fontWeight: '900' },
  content: { padding: 16 },
  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 12 },
  episodeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#171717', borderRadius: 10, padding: 12, marginBottom: 10 },
  episodeNumber: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#242424', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  episodeNumberText: { color: '#FFB366', fontSize: 14, fontWeight: '900' },
  episodeContent: { flex: 1, marginRight: 12 },
  episodeTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  episodeMeta: { color: '#BDBDBD', fontSize: 12, marginTop: 3 },
  episodeDescription: { color: '#D0D0D0', fontSize: 13, lineHeight: 18, marginTop: 6 },
});
