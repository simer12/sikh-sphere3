import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useApp } from '../hooks/useApp';
import { AppText } from '../components/AppText';
import { EmptyState } from '../components/EmptyState';
import { ListItemSkeleton } from '../components/LoadingSkeleton';
import { hapticFeedback } from '../utils/haptics';

interface Bookmark {
  id: string;
  bani_name: string;
  bani_type: string;
  created_at: string;
  notes?: string;
}

export default function BookmarksScreen({ navigation }: any) {
  const { user } = useAuth();
  const { t, fontSize, colors } = useApp();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    if (!user) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    hapticFeedback.warning();
    Alert.alert(
      t.removeBookmark,
      t.removeBookmarkConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.remove,
          style: 'destructive',
          onPress: async () => {
            try {
              hapticFeedback.success();
              const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('id', bookmarkId);

              if (error) throw error;

              setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
            } catch (error) {
              hapticFeedback.error();
              console.error('Error removing bookmark:', error);
              Alert.alert('Error', 'Failed to remove bookmark');
            }
          },
        },
      ]
    );
  };

  const getBaniIcon = (type: string) => {
    switch (type) {
      case 'nitnem':
        return 'book';
      case 'dasam-granth':
        return 'library';
      case 'hukamnama':
        return 'newspaper';
      default:
        return 'document-text';
    }
  };

  const getFilteredBookmarks = () => {
    if (filter === 'all') return bookmarks;
    return bookmarks.filter((b) => b.bani_type === filter);
  };

  const filters = [
    { label: 'All', value: 'all' },
    { label: 'Nitnem', value: 'nitnem' },
    { label: 'Dasam Granth', value: 'dasam-granth' },
    { label: 'Other', value: 'other' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <EmptyState
          icon="bookmark-outline"
          title="Sign In Required"
          message="Please sign in to save and access your bookmarks"
        />
      </View>
    );
  }

  const filteredBookmarks = getFilteredBookmarks();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filter Tabs */}
      <View style={[styles.filterContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterTab, { backgroundColor: colors.surface }, filter === f.value && { backgroundColor: colors.primary }]}
              onPress={() => setFilter(f.value)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: colors.textSecondary },
                  filter === f.value && styles.filterTabTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      {bookmarks.length > 0 && (
        <View style={[styles.statsBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Ionicons name="bookmark" size={20} color={colors.primary} />
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Bookmarks List */}
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={() => {
              setRefreshing(true);
              loadBookmarks();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {filteredBookmarks.length === 0 ? (
          <EmptyState
            illustration="📖"
            title={filter === 'all' ? 'No Bookmarks Yet' : 'No Bookmarks in this Category'}
            message="Bookmark your favorite Banis for quick access"
            actionLabel="Browse Banis"
            onAction={() => navigation.navigate('Nitnem')}
          />
        ) : (
          <View style={styles.bookmarksContainer}>
            {filteredBookmarks.map((bookmark) => (
              <Card key={bookmark.id} style={[styles.bookmarkCard, { backgroundColor: colors.card }]}>
                <Card.Content>
                  <View style={styles.bookmarkItem}>
                    <View style={[styles.bookmarkIconContainer, { backgroundColor: colors.surface }]}>
                      <Ionicons
                        name={getBaniIcon(bookmark.bani_type)}
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.bookmarkContent}>
                      <Text style={[styles.bookmarkTitle, { color: colors.text }]}>{bookmark.bani_name}</Text>
                      <View style={styles.bookmarkMeta}>
                        <Text style={[styles.bookmarkType, { color: colors.primary }]}>
                          {bookmark.bani_type.replace('-', ' ').toUpperCase()}
                        </Text>
                        <Text style={[styles.bookmarkDivider, { color: colors.textTertiary }]}>•</Text>
                        <Text style={[styles.bookmarkDate, { color: colors.textSecondary }]}>
                          {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                      {bookmark.notes && (
                        <Text style={[styles.bookmarkNotes, { color: colors.textSecondary }]} numberOfLines={2}>
                          {bookmark.notes}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeBookmark(bookmark.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterTabActive: {},
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  statsText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  bookmarksContainer: {
    padding: 16,
  },
  bookmarkCard: {
    marginBottom: 12,
    elevation: 2,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkContent: {
    flex: 1,
    marginLeft: 12,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookmarkMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkType: {
    fontSize: 11,
    fontWeight: '600',
  },
  bookmarkDivider: {
    marginHorizontal: 6,
    fontSize: 11,
  },
  bookmarkDate: {
    fontSize: 11,
  },
  bookmarkNotes: {
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyCard: {
    margin: 16,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 20,
  },
  exploreButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
