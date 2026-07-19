import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useApp } from '../hooks/useApp';

interface LiveStream {
  id: string;
  name: string;
  location: string;
  url: string;
  icon: string;
  quality: string;
}

export default function LiveKirtanScreen() {
  const { colors } = useApp();
  const [currentStream, setCurrentStream] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: 2, // DoNotMix
        interruptionModeAndroid: 1, // DoNotMix
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const stream: LiveStream = {
    id: '1',
    name: 'Sri Harmandir Sahib',
    location: 'Amritsar, Punjab, India',
    url: 'https://live.sgpc.net:8442/;',
    icon: 'radio',
    quality: '128 kbps',
  };

  const playStream = async () => {
    try {
      setIsLoading(true);
      
      // Stop current stream if playing
      if (sound) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            await sound.stopAsync();
          }
          await sound.unloadAsync();
        } catch (error) {
          console.log('Cleanup error:', error);
        }
        setSound(null);
      }

      console.log(`Playing: ${stream.name}`);
      console.log(`URL: ${stream.url}`);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: stream.url },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setCurrentStream(stream.id);
      setIsPlaying(true);
      setIsLoading(false);
      
    } catch (error: any) {
      console.error('Error playing stream:', error);
      setIsLoading(false);
      Alert.alert(
        'Stream Error',
        'Unable to play the live stream. Please check your internet connection.',
        [{ text: 'OK' }]
      );
      setIsPlaying(false);
      setCurrentStream(null);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentStream(null);
      }
      if (status.error) {
        console.error('Playback error:', status.error);
        setIsPlaying(false);
        setCurrentStream(null);
      }
    }
  };

  const stopStream = async () => {
    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          await sound.stopAsync();
          await sound.unloadAsync();
        } else {
          await sound.unloadAsync();
        }
        setSound(null);
      }
      setIsPlaying(false);
      setCurrentStream(null);
    } catch (error: any) {
      console.log('Stop stream cleanup:', error.message);
      // Force cleanup even if there's an error
      setSound(null);
      setIsPlaying(false);
      setCurrentStream(null);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.templeIconContainer}>
          <Ionicons name="business" size={60} color="#FFD700" />
        </View>
        <Text style={styles.headerText}>Sri Harmandir Sahib</Text>
        <Text style={styles.goldenTempleText}>The Golden Temple</Text>
        <Text style={styles.subheaderText}>Live Gurbani 24/7</Text>
      </View>

      {/* Main Stream Card */}
      <View style={styles.mainContent}>
        <Card style={[styles.streamCard, { backgroundColor: colors.card }]}>
          <Card.Content style={styles.streamCardContent}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: colors.surface }]}>
              <View style={[styles.liveIndicator, isPlaying && styles.liveIndicatorActive]} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                {isPlaying ? '🔴 LIVE NOW' : '⚫ Ready to Stream'}
              </Text>
            </View>

            {/* Location Info */}
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>{stream.location}</Text>
            </View>

            {/* Quality Info */}
            <View style={styles.qualityContainer}>
              <Ionicons name="musical-notes" size={16} color={colors.textSecondary} />
              <Text style={[styles.qualityText, { color: colors.textSecondary }]}>High Quality • {stream.quality}</Text>
            </View>

            {/* Play/Stop Button */}
            <TouchableOpacity
              style={[
                styles.controlButton,
                { backgroundColor: colors.primary },
                isPlaying && styles.controlButtonActive,
                isLoading && styles.controlButtonLoading
              ]}
              onPress={() => {
                if (isPlaying) {
                  stopStream();
                } else {
                  playStream();
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="large" color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name={isPlaying ? 'stop' : 'play'}
                    size={50}
                    color="#fff"
                  />
                  <Text style={styles.controlButtonText}>
                    {isPlaying ? 'Stop Kirtan' : 'Play Kirtan'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Now Playing Info */}
            {isPlaying && (
              <View style={styles.nowPlayingContainer}>
                <Ionicons name="radio" size={20} color="#FF0000" />
                <Text style={styles.nowPlayingText}>Playing from Darbar Sahib</Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Info Card */}
        <Card style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Card.Content>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Available 24/7</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="headset-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Background playback supported</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="wifi-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>Requires internet connection</Text>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 32,
    alignItems: 'center',
    paddingTop: 40,
  },
  templeIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  goldenTempleText: {
    fontSize: 16,
    color: '#FFD700',
    marginTop: 4,
    fontWeight: '600',
  },
  subheaderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
  },
  mainContent: {
    padding: 20,
  },
  streamCard: {
    elevation: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  streamCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#666',
    marginRight: 8,
  },
  liveIndicatorActive: {
    backgroundColor: '#FF0000',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 16,
    marginLeft: 8,
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  qualityText: {
    fontSize: 14,
    marginLeft: 6,
  },
  controlButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 24,
  },
  controlButtonActive: {
    backgroundColor: '#d32f2f',
  },
  controlButtonLoading: {
    backgroundColor: '#999',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  nowPlayingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  nowPlayingText: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '600',
    marginLeft: 8,
  },
  infoCard: {
    marginTop: 20,
    elevation: 2,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});
