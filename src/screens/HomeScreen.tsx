import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../stores';
import { fetchAllTracks } from '../services/jellyfin/library';
import MiniPlayer from '../components/player/MiniPlayer';
import { getStreamUrl } from '../services/jellyfin/playback';
import { setQueue } from '../stores/playerSlice';
import { ArrowLeftCircle, FlipVertical, Play, Search, X } from 'lucide-react-native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { userid, token, serverUrl } = useSelector((s: RootState) => s.auth);

  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tracks
  useEffect(() => {
    const load = async () => {
      if (!userid || !serverUrl || !token) return;

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

    load();
  }, [userid, serverUrl, token]);

  const handlePressTrack = (selectedTrack: any) => {
    if (!tracks.length || !serverUrl || !token) return;

    const formattedQueue = tracks.map((track: any) => ({
      id: track.Id,
      url: getStreamUrl(serverUrl, track.Id, token),
      title: track.Name,
      artist: track.Artists?.join(', ') || 'Unknown',
      artwork: track.AlbumId
        ? `${serverUrl}/Items/${track.AlbumId}/Images/Primary?api_key=${token}`
        : undefined,
    }));

    const startIndex = tracks.findIndex((t: any) => t.Id === selectedTrack.Id);
    dispatch(setQueue({ queue: formattedQueue, startIndex: Math.max(0, startIndex) }));
  };

  const trendingData = tracks.slice(0, 5); // Take first 5 for mock trending
  const newReleases = tracks.slice(0, 10); // Take top 10 for mock new releases

  // Extract unique artists from tracks
  const artistsMap = new Map();
  tracks.forEach(t => {
    if (t.ArtistItems && t.ArtistItems.length > 0) {
      t.ArtistItems.forEach((a: any) => {
        if (!artistsMap.has(a.Id)) {
          artistsMap.set(a.Id, {
            id: a.Id,
            name: a.Name,
            image: `${serverUrl}/Items/${a.Id}/Images/Primary?api_key=${token}`
          })
        }
      })
    }
  })
  const suggestedArtists = Array.from(artistsMap.values()).slice(0, 8);

  const formatDuration = (ticks: number) => {
    if (!ticks) return '0:00';
    const seconds = Math.floor(ticks / 10000000);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 15 }}>
            <Text style={styles.greeting}>Good evening</Text>
            <Text style={styles.subGreeting}>Discover something new today</Text>
          </View>

          <Image
            source={{ uri: 'https://picsum.photos/100' }}
            style={styles.profile}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        {/* Trending */}
        {trendingData.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <FlatList
              data={trendingData}
              horizontal
              keyExtractor={item => item.Id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.trendingCard} onPress={() => handlePressTrack(item)}>
                  <Image
                    source={{ uri: item.AlbumId ? `${serverUrl}/Items/${item.AlbumId}/Images/Primary?api_key=${token}` : 'https://picsum.photos/400/300' }}
                    style={styles.trendingImage}
                  />
                  <View style={styles.trendingOverlay}>
                    <Text style={styles.trendingTitle}>{item.Name}</Text>
                    <Text style={styles.trendingArtist}>{item.Artists?.join(', ') || 'Unknown'}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* Suggested Artists */}
        {suggestedArtists.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Suggested Artists</Text>
            <FlatList
              data={suggestedArtists}
              horizontal
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.artistCard}
                  onPress={() => navigation.navigate('ArtistTracks', { artistId: item.id })}
                >
                  <Image source={{ uri: item.image }} style={styles.artistImage} />
                  <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

        {/* New Releases */}
        {newReleases.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>New Releases</Text>
            {newReleases.map(track => (
              <TouchableOpacity key={track.Id} style={styles.trackItem} onPress={() => handlePressTrack(track)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trackTitle}>{track.Name}</Text>
                  <Text style={styles.trackMeta}>
                    {track.Artists?.join(', ')} • {formatDuration(track.RunTimeTicks)}
                  </Text>
                </View>
                <Play size={22} color="#aaa" />
              </TouchableOpacity>
            ))}
          </>
        )}


      </ScrollView>

      {/* Search Overlay */}
      {
        searchQuery.length > 0 && (
          <View style={styles.searchOverlay}>
            <FlatList
              data={tracks.filter(t =>
                t.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.Artists?.join(', ') || '').toLowerCase().includes(searchQuery.toLowerCase())
              )}
              keyExtractor={t => t.Id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.searchResultItem} onPress={() => { handlePressTrack(item); setSearchQuery(''); }}>
                  <Image source={{ uri: item.AlbumId ? `${serverUrl}/Items/${item.AlbumId}/Images/Primary?api_key=${token}` : 'https://picsum.photos/50' }} style={styles.searchResultImage} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.searchResultTitle}>{item.Name}</Text>
                    <Text style={styles.searchResultArtist}>{item.Artists?.join(', ') || 'Unknown'}</Text>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        )
      }

      {/* Global Mini Player */}
      <MiniPlayer />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },

  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  subGreeting: {
    color: '#aaa',
    marginTop: 4,
  },

  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  trendingCard: {
    width: 250,
    height: 150,
    marginLeft: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },

  trendingImage: {
    width: '100%',
    height: '100%',
  },

  trendingOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 8,
  },

  trendingTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },

  trendingArtist: {
    color: '#ccc',
    fontSize: 12,
  },

  artistCard: {
    alignItems: 'center',
    marginLeft: 20,
    width: 70,
  },

  artistImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  artistName: {
    color: '#ccc',
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },

  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1022',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
  },

  trackTitle: {
    color: '#fff',
    fontWeight: '600',
  },

  trackMeta: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#181818',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333'
  },

  navItem: {
    alignItems: 'center',
  },

  navText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1022',
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  searchOverlay: {
    position: 'absolute',
    top: 195, // Moved down to avoid overlapping the header/search bar
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#121212',
    zIndex: 10,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a1630',
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#333'
  },
  searchResultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResultArtist: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },
});