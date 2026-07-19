import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { useAkaalOriginals } from '../contexts/AkaalOriginalsContext';

export default function AkaalEpisodeDetailScreen({ route, navigation }: any) {
  const { episodeId } = route.params;
  const { getEpisode, getSeason, getSeasonEpisodes, getEpisodeProgress, markEpisodeProgress } = useAkaalOriginals();
  const episode = getEpisode(episodeId);
  const webViewRef = useRef<WebView>(null);

  if (!episode) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Episode not found</Text>
      </View>
    );
  }

  const season = getSeason(episode.seasonId);
  const related = getSeasonEpisodes(episode.seasonId).filter((item) => item.id !== episode.id).slice(0, 3);
  const progress = getEpisodeProgress(episode.id);
  const remainingMinutes = progress
    ? Math.max(0, Math.ceil((progress.durationSeconds - progress.watchedSeconds) / 60))
    : episode.durationMinutes;

  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(progress?.watchedSeconds || 0);
  const initialStartSeconds = useRef(progress?.completed ? 0 : (progress?.watchedSeconds || 0));

  // Sync watchedSeconds and reset play state when the active episode changes
  useEffect(() => {
    const startSecs = progress?.completed ? 0 : (progress?.watchedSeconds || 0);
    setWatchedSeconds(progress?.watchedSeconds || 0);
    initialStartSeconds.current = startSecs;
    setIsPlaying(false);
  }, [episode.id]);

  const markStarted = () => markEpisodeProgress(episode.id, Math.max(watchedSeconds, 60), false);
  const markWatched = () => {
    const durationSeconds = episode.durationMinutes * 60;
    setWatchedSeconds(durationSeconds);
    markEpisodeProgress(episode.id, durationSeconds, true);
    setIsPlaying(false);
  };

  const handlePlayVideo = () => {
    if (isPlaying) {
      webViewRef.current?.postMessage(JSON.stringify({ action: 'pause' }));
    } else {
      markStarted();
      webViewRef.current?.postMessage(JSON.stringify({ action: 'play' }));
    }
  };

  // Handle real-time event updates sent from the YouTube iframe player inside the WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.event === 'play') {
        setIsPlaying(true);
      } else if (data.event === 'pause') {
        setIsPlaying(false);
      } else if (data.event === 'ended') {
        setIsPlaying(false);
        const durationSeconds = episode.durationMinutes * 60;
        setWatchedSeconds(durationSeconds);
        markEpisodeProgress(episode.id, durationSeconds, true);
      } else if (data.event === 'timeupdate') {
        const roundedTime = Math.round(data.currentTime);
        setWatchedSeconds(roundedTime);
        
        // Sync to database/cache in 5-second intervals to optimize network calls
        if (roundedTime > 0 && roundedTime % 5 === 0) {
          markEpisodeProgress(episode.id, roundedTime, false);
        }
      }
    } catch (e) {
      console.error('Error parsing player message:', e);
    }
  };

  // Memoize HTML page to keep source reference stable across re-renders
  const embedHtml = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body, html { margin: 0; padding: 0; background-color: #000; width: 100%; height: 100%; overflow: hidden; }
          .video-container { width: 100%; height: 100%; position: relative; }
          #player { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <div class="video-container">
          <div id="player"></div>
        </div>
        
        <script>
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          var player;
          var progressInterval;

          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              height: '100%',
              width: '100%',
              videoId: '${episode.youtubeVideoId}',
              playerVars: {
                'playsinline': 1,
                'rel': 0,
                'controls': 1,
                'enablejsapi': 1,
                'origin': 'https://sikhsphere.com',
                'start': ${initialStartSeconds.current}
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
              }
            });
          }

          function sendToReactNative(data) {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            }
          }

          function onPlayerReady(event) {
            var handlePlayMessage = function(eventMsg) {
              try {
                var data = JSON.parse(eventMsg.data);
                if (data.action === 'play') {
                  player.playVideo();
                } else if (data.action === 'pause') {
                  player.pauseVideo();
                }
              } catch(e) {}
            };

            window.addEventListener('message', handlePlayMessage);
            document.addEventListener('message', handlePlayMessage);
          }

          function startTracking() {
            if (progressInterval) clearInterval(progressInterval);
            progressInterval = setInterval(function() {
              if (player && player.getCurrentTime) {
                sendToReactNative({
                  event: 'timeupdate',
                  currentTime: player.getCurrentTime(),
                  duration: player.getDuration()
                });
              }
            }, 1000);
          }

          function stopTracking() {
            if (progressInterval) {
              clearInterval(progressInterval);
              progressInterval = null;
            }
          }

          function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) {
              sendToReactNative({ event: 'play', currentTime: player.getCurrentTime() });
              startTracking();
            } else if (event.data === YT.PlayerState.PAUSED) {
              sendToReactNative({ event: 'pause', currentTime: player.getCurrentTime() });
              stopTracking();
            } else if (event.data === YT.PlayerState.ENDED) {
              sendToReactNative({ event: 'ended' });
              stopTracking();
            }
          }
        </script>
      </body>
    </html>
  `, [episode.id]);

  // Memoize source object so WebView does not trigger reload checks on parent state updates
  const webViewSource = useMemo(() => ({
    html: embedHtml,
    baseUrl: 'https://sikhsphere.com'
  }), [embedHtml]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.playerWrap}>
        {Platform.OS === 'web' ? (
          <ImageBackground source={{ uri: episode.thumbnailUrl }} style={styles.webFallback} imageStyle={styles.webFallbackImage}>
            <View style={styles.webFallbackShade}>
              <TouchableOpacity style={styles.playExternal} onPress={handlePlayVideo}>
                <Ionicons name="play" size={22} color="#111" />
                <Text style={styles.playExternalText}>Play on YouTube</Text>
              </TouchableOpacity>
              <Text style={styles.webFallbackText}>{episode.youtubeUrl}</Text>
            </View>
          </ImageBackground>
        ) : (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            allowsInlineMediaPlayback={true}
            allowsFullscreenVideo={true}
            mediaPlaybackRequiresUserAction={false}
            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            source={webViewSource} 
            onMessage={handleMessage}
            style={styles.webView} 
          />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.seriesLabel}>Akaal Originals</Text>
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.meta}>
          Episode {episode.episodeNumber} • {episode.durationMinutes} min • {season?.title || 'Sikh History'}
        </Text>

        {progress && !progress.completed && (
          <Text style={styles.remaining}>{remainingMinutes} mins remaining</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePlayVideo}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#111" />
            <Text style={styles.primaryButtonText}>{isPlaying ? "Pause" : "Play"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={markWatched}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.secondaryButtonText}>{progress?.completed ? 'Watched' : 'Mark watched'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{episode.description}</Text>

        <DetailBlock title="Important People" items={episode.importantPeople} />
        <DetailBlock title="Locations" items={episode.locations} />
        <DetailBlock title="Timeline" items={[episode.timelineLabel]} />
        <DetailBlock title="References" items={episode.references} />

        {related.length > 0 && (
          <View style={styles.relatedBlock}>
            <Text style={styles.blockTitle}>Related Episodes</Text>
            {related.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.relatedItem}
                onPress={() => navigation.push('AkaalEpisodeDetail', { episodeId: item.id })}
              >
                <View style={styles.relatedIcon}>
                  <Ionicons name="play" size={15} color="#FF9933" />
                </View>
                <View style={styles.relatedTextWrap}>
                  <Text style={styles.relatedTitle}>{item.title}</Text>
                  <Text style={styles.relatedMeta}>Episode {item.episodeNumber} • {item.durationMinutes} min</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  const cleanItems = items.filter(Boolean);
  if (cleanItems.length === 0) return null;

  return (
    <View style={styles.detailBlock}>
      <Text style={styles.blockTitle}>{title}</Text>
      <View style={styles.chipWrap}>
        {cleanItems.map((item) => (
          <View key={item} style={styles.chip}>
            <Text style={styles.chipText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0B0B' },
  empty: { flex: 1, backgroundColor: '#0B0B0B', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  playerWrap: { height: 240, backgroundColor: '#000' },
  webView: { flex: 1, backgroundColor: '#000' },
  webFallback: { flex: 1 },
  webFallbackImage: { opacity: 0.8 },
  webFallbackShade: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: 'rgba(0,0,0,0.35)' },
  playExternal: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  playExternalText: { color: '#111', fontSize: 15, fontWeight: '900' },
  webFallbackText: { color: '#D6D6D6', fontSize: 12, marginTop: 12, textAlign: 'center' },
  content: { padding: 18 },
  seriesLabel: { color: '#FFB366', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 30, fontWeight: '900', marginTop: 8 },
  meta: { color: '#BDBDBD', fontSize: 13, fontWeight: '700', marginTop: 8 },
  remaining: { color: '#FFB366', fontSize: 13, fontWeight: '800', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 18 },
  primaryButton: { backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 7 },
  primaryButtonText: { color: '#111', fontSize: 15, fontWeight: '900' },
  secondaryButton: { backgroundColor: '#242424', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 7 },
  secondaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  description: { color: '#E5E5E5', fontSize: 15, lineHeight: 23, marginTop: 18 },
  detailBlock: { marginTop: 22 },
  blockTitle: { color: '#fff', fontSize: 18, fontWeight: '900', marginBottom: 10 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#1B1B1B', borderRadius: 999, paddingHorizontal: 11, paddingVertical: 7 },
  chipText: { color: '#EAEAEA', fontSize: 13, fontWeight: '700' },
  relatedBlock: { marginTop: 24 },
  relatedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#171717', borderRadius: 10, padding: 12, marginBottom: 10 },
  relatedIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#242424', alignItems: 'center', justifyContent: 'center' },
  relatedTextWrap: { flex: 1, marginLeft: 12 },
  relatedTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  relatedMeta: { color: '#BDBDBD', fontSize: 12, marginTop: 3 },
});
