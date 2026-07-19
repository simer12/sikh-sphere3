import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EpisodePosterCard, SeasonPosterCard } from '../components/AkaalOriginalsCards';
import { useAkaalOriginals } from '../contexts/AkaalOriginalsContext';
import { useAuth } from '../contexts/AuthContext';
import { AkaalOriginalEpisode } from '../data/akaalOriginals';

const browseItems = [
  { label: 'All Seasons', icon: 'albums-outline', filter: 'seasons' },
  { label: 'Characters', icon: 'people-outline', filter: 'people' },
  { label: 'Maps', icon: 'map-outline', filter: 'map' },
  { label: 'Events', icon: 'flag-outline', filter: 'event' },
  { label: 'Battles', icon: 'shield-outline', filter: 'battle' },
  { label: 'Timeline', icon: 'git-branch-outline', filter: 'timeline' },
];

export default function AkaalOriginalsScreen({ navigation }: any) {
  const {
    publishedEpisodes,
    publishedSeasons,
    getContinueWatching,
    getRecentlyAdded,
    getTrendingEpisodes,
    getTrendingSeasons,
    getSeasonProgress,
    getEpisodeProgress,
  } = useAkaalOriginals();
  const { userData } = useAuth();

  const featured = publishedEpisodes.find((episode) => episode.featured) || publishedEpisodes[0];
  const continueWatching = getContinueWatching();
  const recentlyAdded = getRecentlyAdded();
  const trendingEpisodes = getTrendingEpisodes();
  const trendingSeasons = getTrendingSeasons();
  const continueSeason = publishedSeasons
    .map((season) => ({ season, progress: getSeasonProgress(season.id) }))
    .filter((item) => item.progress > 0 && item.progress < 1)
    .sort((a, b) => b.progress - a.progress)[0];

  const renderEpisodeRail = (title: string, data: AkaalOriginalEpisode[]) => {
    if (data.length === 0) return null;
    return (
      <View style={styles.rail}>
        <Text style={styles.railTitle}>{title}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railContent}>
          {data.map((episode) => (
            <EpisodePosterCard
              key={episode.id}
              episode={episode}
              onPress={() => navigation.navigate('AkaalEpisodeDetail', { episodeId: episode.id })}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {featured && (
        <ImageBackground source={{ uri: featured.thumbnailUrl }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroShade}>
            <Text style={styles.kicker}>Akaal Originals</Text>
            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroMeta}>Episode {featured.episodeNumber} • {featured.durationMinutes} min • {featured.timelineLabel}</Text>
            <Text style={styles.heroDescription} numberOfLines={3}>{featured.description}</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => navigation.navigate('AkaalEpisodeDetail', { episodeId: featured.id })}
              >
                <Ionicons name="play" size={18} color="#111" />
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
              {userData?.isAdmin && (
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={() => navigation.navigate('AkaalOriginalsAdmin')}
                >
                  <Ionicons name="settings-outline" size={18} color="#fff" />
                  <Text style={styles.adminButtonText}>Manage</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      )}

      {continueWatching.length > 0 && (
        <View style={styles.continuePanel}>
          <View>
            <Text style={styles.panelLabel}>Continue Watching</Text>
            <Text style={styles.panelTitle}>Episode {continueWatching[0].episodeNumber}</Text>
            <Text style={styles.panelSubtitle}>
              {Math.max(
                1,
                Math.ceil(((getEpisodeProgress(continueWatching[0].id)?.durationSeconds || 0) -
                  (getEpisodeProgress(continueWatching[0].id)?.watchedSeconds || 0)) / 60)
              )} mins remaining
            </Text>
          </View>
          <TouchableOpacity
            style={styles.panelPlay}
            onPress={() => navigation.navigate('AkaalEpisodeDetail', { episodeId: continueWatching[0].id })}
          >
            <Ionicons name="play" size={18} color="#111" />
          </TouchableOpacity>
        </View>
      )}

      {renderEpisodeRail('Recently Added', recentlyAdded)}
      {renderEpisodeRail('Trending', trendingEpisodes)}

      {trendingSeasons.length > 0 && (
        <View style={styles.rail}>
          <Text style={styles.railTitle}>Trending Seasons</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railContent}>
            {trendingSeasons.map((season) => (
              <SeasonPosterCard
                key={season.id}
                season={season}
                onPress={() => navigation.navigate('AkaalSeasonDetail', { seasonId: season.id })}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {continueSeason && (
        <TouchableOpacity
          style={styles.seasonProgressPanel}
          onPress={() => navigation.navigate('AkaalSeasonDetail', { seasonId: continueSeason.season.id })}
        >
          <View>
            <Text style={styles.panelLabel}>Continue Season</Text>
            <Text style={styles.panelTitle}>Season {continueSeason.season.seasonNumber}</Text>
            <Text style={styles.panelSubtitle}>{Math.round(continueSeason.progress * 100)}% Completed</Text>
          </View>
          <View style={styles.seasonProgressRing}>
            <Text style={styles.seasonProgressText}>{Math.round(continueSeason.progress * 100)}%</Text>
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.browseSection}>
        <Text style={styles.railTitle}>Browse</Text>
        <View style={styles.browseGrid}>
          {browseItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.browseCard}
              onPress={() => navigation.navigate('AkaalBrowse', { filter: item.filter, title: item.label })}
            >
              <Ionicons name={item.icon as any} size={24} color="#FF9933" />
              <Text style={styles.browseText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  hero: {
    minHeight: 440,
    justifyContent: 'flex-end',
    backgroundColor: '#151515',
  },
  heroImage: {
    opacity: 0.72,
  },
  heroShade: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 90,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  kicker: {
    color: '#FFB366',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '900',
    marginTop: 8,
  },
  heroMeta: {
    color: '#E8E8E8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  heroDescription: {
    color: '#D8D8D8',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  playButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  playButtonText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '900',
  },
  adminButton: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  continuePanel: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#171717',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelLabel: {
    color: '#FFB366',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  panelSubtitle: {
    color: '#BDBDBD',
    fontSize: 13,
    marginTop: 4,
  },
  panelPlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: {
    marginTop: 16,
  },
  railTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '900',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  railContent: {
    paddingLeft: 16,
    paddingRight: 2,
  },
  seasonProgressPanel: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#171717',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonProgressRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 5,
    borderColor: '#FF9933',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonProgressText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  browseSection: {
    marginTop: 12,
  },
  browseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
  },
  browseCard: {
    width: '48%',
    minHeight: 78,
    borderRadius: 10,
    backgroundColor: '#171717',
    padding: 14,
    justifyContent: 'center',
  },
  browseText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
});
