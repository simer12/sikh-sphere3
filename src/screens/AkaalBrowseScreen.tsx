import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EpisodePosterCard, SeasonPosterCard } from '../components/AkaalOriginalsCards';
import { useAkaalOriginals } from '../contexts/AkaalOriginalsContext';
import { useAuth } from '../contexts/AuthContext';

export default function AkaalBrowseScreen({ route, navigation }: any) {
  const { filter = 'seasons', title = 'Browse' } = route.params || {};
  const { publishedEpisodes, publishedSeasons } = useAkaalOriginals();
  const { userData } = useAuth();

  const filteredEpisodes = publishedEpisodes.filter((episode) => {
    if (filter === 'battle') return episode.category === 'battle' || episode.tags.some((tag) => tag.toLowerCase().includes('battle'));
    if (filter === 'event') return episode.category === 'event' || episode.tags.some((tag) => tag.toLowerCase().includes('event'));
    if (filter === 'map') return episode.category === 'map' || episode.locations.length > 0;
    if (filter === 'timeline') return episode.category === 'timeline' || Boolean(episode.timelineLabel);
    if (filter === 'people') return episode.importantPeople.length > 0;
    return true;
  });

  const groupedPeople = Array.from(new Set(publishedEpisodes.flatMap((episode) => episode.importantPeople))).sort();
  const groupedLocations = Array.from(new Set(publishedEpisodes.flatMap((episode) => episode.locations))).sort();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Akaal Originals</Text>
      <Text style={styles.title}>{title}</Text>

      {filter === 'seasons' ? (
        <View style={styles.seasonGrid}>
          {publishedSeasons.map((season) => (
            <SeasonPosterCard
              key={season.id}
              season={season}
              onPress={() => navigation.navigate('AkaalSeasonDetail', { seasonId: season.id })}
            />
          ))}
        </View>
      ) : (
        <>
          {filter === 'people' && (
            <View style={styles.chipSection}>
              <Text style={styles.sectionTitle}>Characters And People</Text>
              <View style={styles.chipWrap}>
                {groupedPeople.map((person) => (
                  <View key={person} style={styles.chip}>
                    <Ionicons name="person-outline" size={15} color="#FF9933" />
                    <Text style={styles.chipText}>{person}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {filter === 'map' && (
            <View style={styles.chipSection}>
              <Text style={styles.sectionTitle}>Locations</Text>
              <View style={styles.chipWrap}>
                {groupedLocations.map((location) => (
                  <View key={location} style={styles.chip}>
                    <Ionicons name="location-outline" size={15} color="#FF9933" />
                    <Text style={styles.chipText}>{location}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.sectionTitle}>Episodes</Text>
          <View style={styles.episodeGrid}>
            {filteredEpisodes.map((episode) => (
              <EpisodePosterCard
                key={episode.id}
                episode={episode}
                compact
                onPress={() => navigation.navigate('AkaalEpisodeDetail', { episodeId: episode.id })}
              />
            ))}
          </View>
        </>
      )}

      {filteredEpisodes.length === 0 && filter !== 'seasons' && (
        userData?.isAdmin ? (
          <TouchableOpacity style={styles.emptyCard} onPress={() => navigation.navigate('AkaalOriginalsAdmin')}>
            <Ionicons name="add-circle-outline" size={28} color="#FF9933" />
            <Text style={styles.emptyTitle}>No episodes here yet</Text>
            <Text style={styles.emptyText}>Add content from Manage Akaal Originals.</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons name="film-outline" size={28} color="#777" />
            <Text style={styles.emptyTitle}>No episodes here yet</Text>
          </View>
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B' },
  content: { padding: 16 },
  kicker: { color: '#FFB366', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 6, marginBottom: 18 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 12 },
  seasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  episodeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  chipSection: { marginBottom: 22 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#171717', borderRadius: 999, paddingHorizontal: 11, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  emptyCard: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#171717', padding: 22, marginTop: 12 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginTop: 10 },
  emptyText: { color: '#BDBDBD', fontSize: 13, marginTop: 5 },
});
