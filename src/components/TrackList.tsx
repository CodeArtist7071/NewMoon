import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../stores';
import { setQueue } from '../stores/playerSlice';
import { fetchAllTracks } from '../services/jellyfin/library';
import { getStreamUrl } from '../services/jellyfin/playback';
import { useNavigation } from '@react-navigation/native';
import MiniPlayer from './player/MiniPlayer';
import { ArrowLeft, Repeat, Search, Settings, Shuffle } from 'lucide-react-native';

export default function TrackList() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { userid, token, serverUrl } = useSelector((s: RootState) => s.auth);
  const { queue, currentIndex } = useSelector((s: RootState) => s.player);
  const activeTrack = queue[currentIndex];

  const [tracks, setTracks] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, [userid]);

  const load = async () => {
    if (!userid) return;
    try {
      const items = await fetchAllTracks({
        userId: userid,
        token,
        serverUrl,
      });
      setTracks(items || []);
    } catch (err) {
      console.log('FETCH TRACKS ERROR:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().then(() => setRefreshing(false));
  }, []);

  const handlePress = (selectedSong: any) => {
    if (!serverUrl || !token) return;

    // Use current active track list state to populate queue in exact searched/filtered order if we wanted
    const formattedQueue = tracks.map((track) => ({
      id: track.Id,
      url: getStreamUrl(serverUrl, track.Id, token),
      title: track.Name,
      artist: track.Artists?.join(', ') || 'Unknown',
      artwork: track.AlbumId
        ? `${serverUrl}/Items/${track.AlbumId}/Images/Primary?api_key=${token}`
        : undefined,
    }));

    const startIndex = tracks.findIndex((t) => t.Id === selectedSong.Id);
    dispatch(setQueue({ queue: formattedQueue, startIndex: Math.max(0, startIndex) }));
    navigation.navigate('MediaPlayer', { trackIndex: startIndex });
  };

  const playAll = () => {
    if (tracks.length > 0) handlePress(tracks[0]);
  }

  const shuffleAll = () => {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    if (shuffled.length > 0) {
      setTracks(shuffled);
      handlePress(shuffled[0]);
    }
  }

  const formatDuration = (ticks: number) => {
    if (!ticks) return '0:00';
    const seconds = Math.floor(ticks / 10000000);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTracks = tracks.filter((track) =>
    track.Name?.toLowerCase().includes(search.toLowerCase()) ||
    (track.Artists?.join(', ') || '').toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => {
    const isNowPlaying = activeTrack?.id === item.Id;
    const imageUrl = item.AlbumId
      ? `${serverUrl}/Items/${item.AlbumId}/Images/Primary?maxWidth=150&api_key=${token}`
      : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745';

    return (
      <TouchableOpacity
        onPress={() => handlePress(item)}
        style={[
          styles.trackItem,
          isNowPlaying && styles.nowPlayingItem,
        ]}
      >
        <Image source={{ uri: imageUrl }} style={styles.cover} />

        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.trackTitle,
              isNowPlaying && { color: '#b90df2', fontWeight: 'bold' },
            ]}
            numberOfLines={1}
          >
            {item.Name}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.Artists?.join(', ') || 'Unknown Artist'}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {isNowPlaying ? (
            <Text style={styles.nowPlayingText}>Now Playing</Text>
          ) : (
            <Text style={styles.duration}>{formatDuration(item.RunTimeTicks)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#b90df2" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>All Tracks</Text>

        <TouchableOpacity>
          <Settings size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#888" />
        <TextInput
          placeholder="Search tracks, artists..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.playAll} onPress={playAll}>
          <Repeat size={20} color="#fff" />
          <Text style={styles.actionText}>Play All</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shuffle} onPress={shuffleAll}>
          <Shuffle color={"white"} size={20}/>
          <Text style={styles.actionText}>
             Suffle
          </Text>
        </TouchableOpacity>
      </View>

      {/* Track List */}
      <FlatList
        data={filteredTracks}
        keyExtractor={item => item.Id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#b90df2']}
            tintColor="#b90df2"
          />
        }
      />

      {/* Global Mini Player instead of mockup
      <MiniPlayer /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1022',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a1630',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 12,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  playAll: {
    flex: 1,
    backgroundColor: '#b90df2',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  shuffle: {
    flex: 1,
    backgroundColor: '#2a1630',
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  nowPlayingItem: {
    backgroundColor: 'rgba(185,13,242,0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#b90df2',
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#333'
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  trackArtist: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 6,
  },
  duration: {
    color: '#aaa',
    fontSize: 12,
  },
  nowPlayingText: {
    color: '#b90df2',
    fontWeight: 'bold',
    fontSize: 12,
  },
});