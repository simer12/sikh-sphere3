import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAkaalOriginals } from '../contexts/AkaalOriginalsContext';
import {
  AkaalOriginalCategory,
  extractYoutubeVideoId,
  getYoutubeThumbnail,
  AkaalOriginalSeason,
  AkaalOriginalEpisode,
} from '../data/akaalOriginals';

const categories: AkaalOriginalCategory[] = ['history', 'battle', 'event', 'biography', 'map', 'timeline'];

type TabType = 'overview' | 'seasons' | 'episodes';

export default function AkaalOriginalsAdminScreen() {
  const {
    seasons,
    episodes,
    addSeason,
    addEpisode,
    updateEpisode,
    updateSeason,
    deleteEpisode,
    deleteSeason,
    resetLibrary,
  } = useAkaalOriginals();

  // Authentication & Navigation
  const [unlocked, setUnlocked] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Modals Visibility
  const [seasonModalVisible, setSeasonModalVisible] = useState(false);
  const [episodeModalVisible, setEpisodeModalVisible] = useState(false);

  // Editing Elements
  const [editingSeason, setEditingSeason] = useState<AkaalOriginalSeason | null>(null);
  const [editingEpisode, setEditingEpisode] = useState<AkaalOriginalEpisode | null>(null);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Season Form States
  const [seasonTitle, setSeasonTitle] = useState('');
  const [seasonSubtitle, setSeasonSubtitle] = useState('');
  const [seasonDescription, setSeasonDescription] = useState('');
  const [seasonNumber, setSeasonNumber] = useState('');
  const [seasonThumbnailUrl, setSeasonThumbnailUrl] = useState('');
  const [seasonTrailerUrl, setSeasonTrailerUrl] = useState('');
  const [seasonFeatured, setSeasonFeatured] = useState(false);
  const [seasonTrending, setSeasonTrending] = useState(false);
  const [seasonPublished, setSeasonPublished] = useState(true);

  // Episode Form States
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [episodeDescription, setEpisodeDescription] = useState('');
  const [episodeSeasonId, setEpisodeSeasonId] = useState('');
  const [episodeCategory, setEpisodeCategory] = useState<AkaalOriginalCategory>('history');
  const [importantPeople, setImportantPeople] = useState('');
  const [locations, setLocations] = useState('');
  const [timelineLabel, setTimelineLabel] = useState('');
  const [episodeReferences, setEpisodeReferences] = useState('');
  const [episodeFeatured, setEpisodeFeatured] = useState(false);
  const [episodeTrending, setEpisodeTrending] = useState(false);
  const [episodePublished, setEpisodePublished] = useState(true);

  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('akaal_originals_admin_unlocked').then((value) => {
      setUnlocked(value === 'true');
    });
  }, []);

  // Fetch duration/title from YouTube
  const fetchYoutubeMetadata = async (url: string) => {
    const videoId = extractYoutubeVideoId(url);
    if (!videoId || videoId.length < 5) return;

    setFetchingMetadata(true);
    try {
      // 1. Fetch title from oEmbed API
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const oembedRes = await fetch(oembedUrl);
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        if (oembedData.title && !episodeTitle.trim()) {
          setEpisodeTitle(oembedData.title);
        }
      }

      // 2. Fetch watch page HTML to parse duration
      const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
      const watchRes = await fetch(watchUrl);
      if (watchRes.ok) {
        const html = await watchRes.text();
        const durationMatch = html.match(/"approxDurationMs"\s*:\s*"(\d+)"/);
        if (durationMatch?.[1]) {
          const ms = parseInt(durationMatch[1], 10);
          const mins = Math.round(ms / 60000);
          setDurationMinutes(mins.toString());
        } else {
          // ISO 8601 fallback
          const isoMatch = html.match(/<meta\s+itemprop="duration"\s+content="([^"]+)"/i);
          if (isoMatch?.[1]) {
            const isoDuration = isoMatch[1];
            let hours = 0, minutes = 0, seconds = 0;
            const hoursMatch = isoDuration.match(/(\d+)H/);
            const minsMatch = isoDuration.match(/(\d+)M/);
            const secsMatch = isoDuration.match(/(\d+)S/);
            if (hoursMatch) hours = parseInt(hoursMatch[1], 10);
            if (minsMatch) minutes = parseInt(minsMatch[1], 10);
            if (secsMatch) seconds = parseInt(secsMatch[1], 10);
            const totalMins = Math.round((hours * 3600 + minutes * 60 + seconds) / 60);
            setDurationMinutes(totalMins.toString());
          }
        }
      }
    } catch (err) {
      console.log('Failed to fetch YouTube metadata:', err);
    } finally {
      setFetchingMetadata(false);
    }
  };

  const unlockAdmin = async () => {
    if (adminCode.trim() !== '8973') {
      Alert.alert('Admin access', 'Incorrect admin code.');
      return;
    }
    await AsyncStorage.setItem('akaal_originals_admin_unlocked', 'true');
    setUnlocked(true);
  };

  const logoutAdmin = async () => {
    await AsyncStorage.removeItem('akaal_originals_admin_unlocked');
    setUnlocked(false);
    setAdminCode('');
  };

  // Season Handlers
  const openAddSeason = () => {
    setEditingSeason(null);
    setSeasonTitle('');
    setSeasonSubtitle('');
    setSeasonDescription('');
    setSeasonNumber((seasons.length + 1).toString());
    setSeasonThumbnailUrl(getYoutubeThumbnail('dQw4w9WgXcQ'));
    setSeasonTrailerUrl('');
    setSeasonFeatured(false);
    setSeasonTrending(false);
    setSeasonPublished(true);
    setSeasonModalVisible(true);
  };

  const openEditSeason = (season: AkaalOriginalSeason) => {
    setEditingSeason(season);
    setSeasonTitle(season.title);
    setSeasonSubtitle(season.subtitle || '');
    setSeasonDescription(season.description);
    setSeasonNumber(season.seasonNumber.toString());
    setSeasonThumbnailUrl(season.thumbnailUrl);
    setSeasonTrailerUrl(season.trailerYoutubeUrl || '');
    setSeasonFeatured(season.featured);
    setSeasonTrending(season.trending);
    setSeasonPublished(season.published);
    setSeasonModalVisible(true);
  };

  const handleSaveSeason = async () => {
    if (!seasonTitle.trim()) {
      Alert.alert('Missing Info', 'Season title is required.');
      return;
    }

    const data = {
      title: seasonTitle.trim(),
      subtitle: seasonSubtitle.trim(),
      description: seasonDescription.trim() || 'New Akaal Originals season.',
      seasonNumber: parseInt(seasonNumber, 10) || seasons.length + 1,
      thumbnailUrl: seasonThumbnailUrl.trim() || getYoutubeThumbnail('dQw4w9WgXcQ'),
      trailerYoutubeUrl: seasonTrailerUrl.trim(),
      featured: seasonFeatured,
      trending: seasonTrending,
      published: seasonPublished,
    };

    try {
      if (editingSeason) {
        await updateSeason(editingSeason.id, data);
        Alert.alert('Success', 'Season updated successfully.');
      } else {
        await addSeason(data);
        Alert.alert('Success', 'Season created successfully.');
      }
      setSeasonModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save season.');
    }
  };

  const confirmDeleteSeason = (seasonId: string) => {
    Alert.alert(
      'Delete Season',
      'Are you sure you want to delete this season? This will delete all episodes inside it. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSeason(seasonId) },
      ]
    );
  };

  // Episode Handlers
  const openAddEpisode = () => {
    setEditingEpisode(null);
    setEpisodeTitle('');
    setYoutubeUrl('');
    setDurationMinutes('30');
    setEpisodeDescription('');
    const defaultSeasonId = seasons[0]?.id || '';
    setEpisodeSeasonId(defaultSeasonId);

    // Calculate default episode number for this season
    const seasonEpisodes = episodes.filter((ep) => ep.seasonId === defaultSeasonId);
    setEpisodeNumber((seasonEpisodes.length + 1).toString());

    setEpisodeCategory('history');
    setImportantPeople('');
    setLocations('');
    setTimelineLabel('');
    setEpisodeReferences('');
    setEpisodeFeatured(false);
    setEpisodeTrending(false);
    setEpisodePublished(true);
    setEpisodeModalVisible(true);
  };

  const openEditEpisode = (episode: AkaalOriginalEpisode) => {
    setEditingEpisode(episode);
    setEpisodeTitle(episode.title);
    setEpisodeNumber(episode.episodeNumber.toString());
    setYoutubeUrl(episode.youtubeUrl);
    setDurationMinutes(episode.durationMinutes.toString());
    setEpisodeDescription(episode.description);
    setEpisodeSeasonId(episode.seasonId);
    setEpisodeCategory(episode.category);
    setImportantPeople(episode.importantPeople.join(', '));
    setLocations(episode.locations.join(', '));
    setTimelineLabel(episode.timelineLabel);
    setEpisodeReferences(episode.references.join(', '));
    setEpisodeFeatured(episode.featured);
    setEpisodeTrending(episode.trending);
    setEpisodePublished(episode.published);
    setEpisodeModalVisible(true);
  };

  const handleSaveEpisode = async () => {
    if (!episodeTitle.trim() || !youtubeUrl.trim()) {
      Alert.alert('Missing Info', 'Episode title and YouTube URL are required.');
      return;
    }

    const videoId = extractYoutubeVideoId(youtubeUrl);
    const data = {
      title: episodeTitle.trim(),
      episodeNumber: parseInt(episodeNumber, 10) || 1,
      youtubeUrl: youtubeUrl.trim(),
      youtubeVideoId: videoId,
      thumbnailUrl: getYoutubeThumbnail(videoId),
      description: episodeDescription.trim(),
      durationMinutes: Math.round(Number(durationMinutes)) || 30,
      seasonId: episodeSeasonId || seasons[0]?.id,
      category: episodeCategory,
      importantPeople: importantPeople.split(',').map((item) => item.trim()).filter(Boolean),
      locations: locations.split(',').map((item) => item.trim()).filter(Boolean),
      timelineLabel: timelineLabel.trim(),
      references: episodeReferences.split(',').map((item) => item.trim()).filter(Boolean),
      tags: [episodeCategory],
      featured: episodeFeatured,
      trending: episodeTrending,
      published: episodePublished,
    };

    try {
      if (editingEpisode) {
        await updateEpisode(editingEpisode.id, data);
        Alert.alert('Success', 'Episode updated successfully.');
      } else {
        await addEpisode(data);
        Alert.alert('Success', 'Episode created successfully.');
      }
      setEpisodeModalVisible(false);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to save episode.');
    }
  };

  const confirmDeleteEpisode = (episodeId: string) => {
    Alert.alert(
      'Delete Episode',
      'Are you sure you want to delete this episode? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEpisode(episodeId) },
      ]
    );
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'Reset Library',
      'Are you sure you want to reload all database values and clear your cached watch progress? This does not delete any newly created cloud records.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetLibrary },
      ]
    );
  };

  // Filters
  const filteredEpisodes = episodes.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.importantPeople.some((p) => p.toLowerCase().includes(q))
    );
  });

  if (!unlocked) {
    return (
      <View style={styles.lockedContainer}>
        <View style={styles.lockedCard}>
          <Ionicons name="lock-closed-outline" size={38} color="#FF9933" />
          <Text style={styles.lockedTitle}>Admin Access</Text>
          <Text style={styles.lockedText}>Enter the admin code to manage Akaal Originals content.</Text>
          <TextInput
            value={adminCode}
            onChangeText={setAdminCode}
            placeholder="Admin code"
            placeholderTextColor="#777"
            secureTextEntry
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={unlockAdmin}>
            <Ionicons name="key-outline" size={18} color="#111" />
            <Text style={styles.primaryButtonText}>Unlock Dashboard</Text>
          </TouchableOpacity>
          <Text style={styles.lockedHint}>Authorization code required</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Developer Portal</Text>
          <Text style={styles.title}>Originals Manager</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logoutAdmin}>
          <Ionicons name="log-out-outline" size={20} color="#FF6666" />
        </TouchableOpacity>
      </View>

      {/* Styled Tab Bar */}
      <View style={styles.tabBar}>
        {(['overview', 'seasons', 'episodes'] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'overview' && (
          <View>
            <Text style={styles.sectionTitle}>Dashboard Overview</Text>

            {/* Premium Stat Grid */}
            <View style={styles.statGrid}>
              <View style={styles.statCard}>
                <Ionicons name="albums-outline" size={24} color="#FF9933" />
                <Text style={styles.statValue}>{seasons.length}</Text>
                <Text style={styles.statLabel}>Seasons</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="film-outline" size={24} color="#FF9933" />
                <Text style={styles.statValue}>{episodes.length}</Text>
                <Text style={styles.statLabel}>Episodes</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="eye-outline" size={24} color="#FF9933" />
                <Text style={styles.statValue}>
                  {episodes.filter((e) => e.published).length}
                </Text>
                <Text style={styles.statLabel}>Published</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="flame-outline" size={24} color="#FF9933" />
                <Text style={styles.statValue}>
                  {episodes.filter((e) => e.trending).length}
                </Text>
                <Text style={styles.statLabel}>Trending</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Quick Operations</Text>
              <Text style={styles.cardDesc}>
                Manage overall cache status and populate base tables.
              </Text>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetConfirm}>
                <Ionicons name="refresh-outline" size={18} color="#fff" />
                <Text style={styles.resetButtonText}>Refresh & Reset Cache</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'seasons' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Seasons Directory</Text>
              <TouchableOpacity style={styles.addButton} onPress={openAddSeason}>
                <Ionicons name="add" size={16} color="#111" />
                <Text style={styles.addButtonText}>Add Season</Text>
              </TouchableOpacity>
            </View>

            {seasons.map((season) => (
              <View key={season.id} style={styles.entityCard}>
                <View style={styles.entityHeader}>
                  <Text style={styles.entityTitle}>
                    S{season.seasonNumber}: {season.title}
                  </Text>
                  <View style={styles.badgeRow}>
                    <Text
                      style={[
                        styles.badge,
                        season.published ? styles.badgeSuccess : styles.badgeDanger,
                      ]}
                    >
                      {season.published ? 'Published' : 'Hidden'}
                    </Text>
                    {season.featured && (
                      <Text style={[styles.badge, styles.badgeWarning]}>Featured</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.entitySubtitle} numberOfLines={2}>
                  {season.description}
                </Text>
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => openEditSeason(season)}
                  >
                    <Ionicons name="create-outline" size={16} color="#FF9933" />
                    <Text style={styles.actionBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnDanger]}
                    onPress={() => confirmDeleteSeason(season.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#FF6666" />
                    <Text style={styles.actionBtnTextDanger}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'episodes' && (
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Episodes Directory</Text>
              <TouchableOpacity style={styles.addButton} onPress={openAddEpisode}>
                <Ionicons name="add" size={16} color="#111" />
                <Text style={styles.addButtonText}>Add Episode</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search episodes..."
              placeholderTextColor="#777"
              style={styles.searchBar}
            />

            {filteredEpisodes.map((episode) => {
              const epSeason = seasons.find((s) => s.id === episode.seasonId);
              return (
                <View key={episode.id} style={styles.entityCard}>
                  <View style={styles.entityHeader}>
                    <Text style={styles.entityTitle} numberOfLines={1}>
                      S{epSeason?.seasonNumber || '?'}:Ep{episode.episodeNumber} • {episode.title}
                    </Text>
                    <View style={styles.badgeRow}>
                      <Text
                        style={[
                          styles.badge,
                          episode.published ? styles.badgeSuccess : styles.badgeDanger,
                        ]}
                      >
                        {episode.published ? 'Published' : 'Hidden'}
                      </Text>
                      {episode.trending && (
                        <Text style={[styles.badge, styles.badgeOrange]}>Trending</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.entitySubtitle} numberOfLines={2}>
                    {episode.description || 'No description provided.'}
                  </Text>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditEpisode(episode)}
                    >
                      <Ionicons name="create-outline" size={16} color="#FF9933" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.actionBtnDanger]}
                      onPress={() => confirmDeleteEpisode(episode.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FF6666" />
                      <Text style={styles.actionBtnTextDanger}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Season CRUD Modal */}
      <Modal visible={seasonModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSeason ? 'Edit Season' : 'Add Season'}
              </Text>
              <TouchableOpacity onPress={() => setSeasonModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                value={seasonTitle}
                onChangeText={setSeasonTitle}
                placeholder="Season Title"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Subtitle</Text>
              <TextInput
                value={seasonSubtitle}
                onChangeText={setSeasonSubtitle}
                placeholder="Season Subtitle"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                value={seasonDescription}
                onChangeText={setSeasonDescription}
                placeholder="Description details..."
                placeholderTextColor="#777"
                multiline
                style={[styles.formInput, styles.formTextArea]}
              />

              <Text style={styles.formLabel}>Season Number</Text>
              <TextInput
                value={seasonNumber}
                onChangeText={setSeasonNumber}
                placeholder="e.g. 1"
                placeholderTextColor="#777"
                keyboardType="numeric"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Thumbnail URL</Text>
              <TextInput
                value={seasonThumbnailUrl}
                onChangeText={setSeasonThumbnailUrl}
                placeholder="URL to image thumbnail"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Trailer YouTube URL</Text>
              <TextInput
                value={seasonTrailerUrl}
                onChangeText={setSeasonTrailerUrl}
                placeholder="Optional YouTube Trailer Link"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <ToggleRow label="Featured" value={seasonFeatured} onValueChange={setSeasonFeatured} />
              <ToggleRow label="Trending" value={seasonTrending} onValueChange={setSeasonTrending} />
              <ToggleRow label="Published" value={seasonPublished} onValueChange={setSeasonPublished} />

              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveSeason}>
                <Ionicons name="save-outline" size={18} color="#111" />
                <Text style={styles.modalSaveButtonText}>Save Season</Text>
              </TouchableOpacity>
              <View style={styles.bottomGap} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Episode CRUD Modal */}
      <Modal visible={episodeModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEpisode ? 'Edit Episode' : 'Add Episode'}
                {fetchingMetadata && ' (Loading YouTube info...)'}
              </Text>
              <TouchableOpacity onPress={() => setEpisodeModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.formLabel}>YouTube Video URL</Text>
              <TextInput
                value={youtubeUrl}
                onChangeText={(val) => {
                  setYoutubeUrl(val);
                  if (val.includes('youtu.be') || val.includes('youtube.com')) {
                    fetchYoutubeMetadata(val);
                  }
                }}
                placeholder="Paste YouTube Link"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Title</Text>
              <TextInput
                value={episodeTitle}
                onChangeText={setEpisodeTitle}
                placeholder="Episode Title"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Episode Number</Text>
              <TextInput
                value={episodeNumber}
                onChangeText={setEpisodeNumber}
                placeholder="e.g., 1"
                placeholderTextColor="#777"
                keyboardType="numeric"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Duration (Minutes)</Text>
              <TextInput
                value={durationMinutes}
                onChangeText={setDurationMinutes}
                placeholder="Duration e.g., 30"
                placeholderTextColor="#777"
                keyboardType="numeric"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                value={episodeDescription}
                onChangeText={setEpisodeDescription}
                placeholder="Description of the video..."
                placeholderTextColor="#777"
                multiline
                style={[styles.formInput, styles.formTextArea]}
              />

              <Text style={styles.formLabel}>Season</Text>
              <View style={styles.chipRow}>
                {seasons.map((season) => (
                  <TouchableOpacity
                    key={season.id}
                    style={[
                      styles.chip,
                      episodeSeasonId === season.id && styles.activeChip,
                    ]}
                    onPress={() => {
                      setEpisodeSeasonId(season.id);
                      if (!editingEpisode) {
                        const seasonEpisodes = episodes.filter((ep) => ep.seasonId === season.id);
                        setEpisodeNumber((seasonEpisodes.length + 1).toString());
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        episodeSeasonId === season.id && styles.activeChipText,
                      ]}
                    >
                      S{season.seasonNumber}: {season.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Category</Text>
              <View style={styles.chipRow}>
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.chip,
                      episodeCategory === item && styles.activeChip,
                    ]}
                    onPress={() => setEpisodeCategory(item)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        episodeCategory === item && styles.activeChipText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Important People (comma separated)</Text>
              <TextInput
                value={importantPeople}
                onChangeText={setImportantPeople}
                placeholder="e.g. Guru Gobind Singh Ji, Baba Deep Singh Ji"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Locations (comma separated)</Text>
              <TextInput
                value={locations}
                onChangeText={setLocations}
                placeholder="e.g. Amritsar, Anandpur Sahib"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>Timeline Label</Text>
              <TextInput
                value={timelineLabel}
                onChangeText={setTimelineLabel}
                placeholder="e.g. Late 1600s, 1704"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>References (comma separated)</Text>
              <TextInput
                value={episodeReferences}
                onChangeText={setEpisodeReferences}
                placeholder="e.g. Suraj Prakash, Panth Prakash"
                placeholderTextColor="#777"
                style={styles.formInput}
              />

              <ToggleRow label="Featured" value={episodeFeatured} onValueChange={setEpisodeFeatured} />
              <ToggleRow label="Trending" value={episodeTrending} onValueChange={setEpisodeTrending} />
              <ToggleRow label="Published" value={episodePublished} onValueChange={setEpisodePublished} />

              <TouchableOpacity style={styles.modalSaveButton} onPress={handleSaveEpisode}>
                <Ionicons name="save-outline" size={18} color="#111" />
                <Text style={styles.modalSaveButtonText}>Save Episode</Text>
              </TouchableOpacity>
              <View style={styles.bottomGap} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#555', true: '#FF9933' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Auth Screen
  lockedContainer: {
    flex: 1,
    backgroundColor: '#0B0B0B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  lockedCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242424',
  },
  lockedTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 14,
  },
  lockedText: {
    color: '#BDBDBD',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  lockedHint: {
    color: '#555',
    fontSize: 12,
    marginTop: 14,
    fontWeight: '700',
  },

  // Main UI
  container: {
    flex: 1,
    backgroundColor: '#0B0B0B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#1F1F1F',
    backgroundColor: '#0F0F0F',
  },
  kicker: {
    color: '#FF9933',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 3,
  },
  logoutButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tab Bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F0F0F',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#1F1F1F',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabButton: {
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  tabText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '800',
  },
  activeTabText: {
    color: '#FF9933',
  },

  // Scroll Content
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF9933',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '800',
  },
  searchBar: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 16,
  },

  // Stats Grid
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242424',
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },

  // Card panel
  card: {
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#242424',
    marginBottom: 16,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
  },
  cardDesc: {
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16,
  },

  // Entities Cards
  entityCard: {
    backgroundColor: '#141414',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#242424',
    padding: 16,
    marginBottom: 12,
  },
  entityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  entityTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    flex: 1,
    marginRight: 8,
  },
  entitySubtitle: {
    color: '#888',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  badgeSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    color: '#4CAF50',
  },
  badgeDanger: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    color: '#F44336',
  },
  badgeOrange: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
    color: '#FF9800',
  },
  badgeWarning: {
    backgroundColor: 'rgba(255, 235, 59, 0.15)',
    color: '#FFEE58',
  },

  actionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#242424',
    paddingTop: 12,
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtnDanger: {
    marginLeft: 'auto',
  },
  actionBtnText: {
    color: '#FF9933',
    fontSize: 13,
    fontWeight: '800',
  },
  actionBtnTextDanger: {
    color: '#FF6666',
    fontSize: 13,
    fontWeight: '800',
  },

  // Modals Styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    backgroundColor: '#0F0F0F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#242424',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1F1F1F',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  modalForm: {
    padding: 20,
  },
  formLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 4,
  },
  formInput: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 16,
  },
  formTextArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalSaveButton: {
    backgroundColor: '#FF9933',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 120,
  },
  modalSaveButtonText: {
    color: '#111',
    fontSize: 15,
    fontWeight: '900',
  },
  bottomGap: {
    height: 100,
  },

  // Buttons & Controls
  input: {
    backgroundColor: '#0B0B0B',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#242424',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 12,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#111',
    fontSize: 14,
    fontWeight: '900',
  },
  resetButton: {
    backgroundColor: '#4A1D1D',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#1E1E1E',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2D2D2D',
  },
  activeChip: {
    backgroundColor: '#FF9933',
    borderColor: '#FF9933',
  },
  chipText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '800',
  },
  activeChipText: {
    color: '#111',
    fontWeight: '900',
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#1A1A1A',
    marginBottom: 12,
  },
  toggleLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
