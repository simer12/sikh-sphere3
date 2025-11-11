import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { Audio } from 'expo-av';

export default function LiveKirtanScreen() {
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const liveStreams = [
    {
      id: '1',
      name: 'Sri Harmandir Sahib',
      location: 'Amritsar, Punjab',
      url: 'https://live.sgpc.net/hls/live.m3u8',
      icon: 'radio',
    },
    {
      id: '2',
      name: 'Gurdwara Bangla Sahib',
      location: 'New Delhi',
      url: 'https://live.example.com/bangla-sahib',
      icon: 'radio',
    },
    {
      id: '3',
      name: 'Gurdwara Sis Ganj Sahib',
      location: 'Delhi',
      url: 'https://live.example.com/sis-ganj',
      icon: 'radio',
    },
  ];

  const kirtanPlaylists = [
    {
      id: '1',
      title: 'Morning Raag Collection',
      artist: 'Various Artists',
      duration: '2 hours',
      icon: 'musical-notes',
    },
    {
      id: '2',
      title: 'Asa Di Vaar',
      artist: 'Bhai Harjinder Singh Ji',
      duration: '45 mins',
      icon: 'musical-notes',
    },
    {
      id: '3',
      title: 'Sukhmani Sahib',
      artist: 'Bhai Joginder Singh Riar',
      duration: '1.5 hours',
      icon: 'musical-notes',
    },
  ];

  const playStream = async (url: string, streamId: string) => {
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentStream(streamId);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing stream:', error);
    }
  };

  const stopStream = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setCurrentStream(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="radio" size={40} color={theme.colors.primary} />
        <Text style={styles.headerText}>Live Gurbani</Text>
        <Text style={styles.subheaderText}>24/7 Kirtan from Gurdwaras</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔴 Live Streams</Text>
        {liveStreams.map((stream) => (
          <Card key={stream.id} style={styles.card}>
            <Card.Content>
              <View style={styles.streamCard}>
                <View style={styles.streamInfo}>
                  <Text style={styles.streamName}>{stream.name}</Text>
                  <Text style={styles.streamLocation}>{stream.location}</Text>
                  {currentStream === stream.id && isPlaying && (
                    <View style={styles.nowPlayingBadge}>
                      <Text style={styles.nowPlayingText}>● Now Playing</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => {
                    if (currentStream === stream.id && isPlaying) {
                      stopStream();
                    } else {
                      playStream(stream.url, stream.id);
                    }
                  }}
                >
                  <Ionicons
                    name={currentStream === stream.id && isPlaying ? 'stop-circle' : 'play-circle'}
                    size={50}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎵 Kirtan Playlists</Text>
        {kirtanPlaylists.map((playlist) => (
          <Card key={playlist.id} style={styles.card}>
            <TouchableOpacity>
              <Card.Content>
                <View style={styles.playlistCard}>
                  <Ionicons name={playlist.icon as any} size={40} color={theme.colors.primary} />
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistTitle}>{playlist.title}</Text>
                    <Text style={styles.playlistArtist}>{playlist.artist}</Text>
                    <Text style={styles.playlistDuration}>{playlist.duration}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="#ccc" />
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subheaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  streamCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamInfo: {
    flex: 1,
  },
  streamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  streamLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  nowPlayingBadge: {
    marginTop: 8,
  },
  nowPlayingText: {
    fontSize: 12,
    color: '#FF0000',
    fontWeight: 'bold',
  },
  playButton: {
    marginLeft: 16,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
    marginLeft: 16,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  playlistArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  playlistDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
