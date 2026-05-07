import { Plus, SearchAlert, X } from 'lucide-react-native'
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { RootState } from '../stores'
import { fetchAllTracks } from '../services/jellyfin/library'
import { getStreamUrl } from '../services/jellyfin/playback'
import { setQueue } from '../stores/playerSlice'
import MiniPlayer from '../components/player/MiniPlayer'

export default function SearchScreen() {
  const navigation = useNavigation<any>()
  const dispatch = useDispatch()
  const { userid, token, serverUrl } = useSelector((s: RootState) => s.auth)

  const [tracks, setTracks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!userid || !serverUrl || !token) return
      try {
        const items = await fetchAllTracks({
          userId: userid,
          token,
          serverUrl,
        })
        setTracks(items || [])
      } catch (err) {
        console.log('SEARCH FETCH ERR:', err)
      }
    }
    load()
  }, [userid, token, serverUrl])

  const handlePressTrack = (selectedTrack: any) => {
    if (!tracks.length || !serverUrl || !token) return
    const formattedQueue = tracks.map((track: any) => ({
      id: track.Id,
      url: getStreamUrl(serverUrl, track.Id, token),
      title: track.Name,
      artist: track.Artists?.join(', ') || 'Unknown',
      artwork: track.AlbumId
        ? `${serverUrl}/Items/${track.AlbumId}/Images/Primary?api_key=${token}`
        : undefined,
    }))
    const startIndex = tracks.findIndex((t: any) => t.Id === selectedTrack.Id)
    dispatch(setQueue({ queue: formattedQueue, startIndex: Math.max(0, startIndex) }))
  }

  const filteredTracks = tracks.filter((t) =>
    t.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.Artists?.join(', ') || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topResult = filteredTracks.length > 0 ? filteredTracks[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Search</Text>

          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <SearchAlert size={20} color="#b90df2" />
          <TextInput
            placeholder="Artists, songs, or podcasts"
            placeholderTextColor="#aaa"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conditional Search vs Splash Layout */}
      {searchQuery.length > 0 ? (
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          <FlatList
            data={filteredTracks}
            keyExtractor={t => t.Id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.searchResultItem} onPress={() => handlePressTrack(item)}>
                <Image source={{ uri: item.AlbumId ? `${serverUrl}/Items/${item.AlbumId}/Images/Primary?api_key=${token}` : 'https://picsum.photos/50' }} style={styles.searchResultImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.searchResultTitle}>{item.Name}</Text>
                  <Text style={styles.searchResultArtist}>{item.Artists?.join(', ') || 'Unknown'}</Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <Text style={styles.clearText}>Clear All</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Daft Punk', 'Late Night Vibes', 'The Weeknd'].map((item, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{item}</Text>
                  <X size={14} color="#aaa" />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Top Result static placeholder */}
          <View style={styles.section}>
            <Text style={styles.sectionMainTitle}>Top Result</Text>

            <View style={styles.topResultCard}>
              <Image
                source={{
                  uri: topResult?.AlbumId ? `${serverUrl}/Items/${topResult.AlbumId}/Images/Primary?api_key=${token}` : 'https://i.scdn.co/image/ab67616d0000b2738a5f4b37eecb1cfd4c5c8f1b',
                }}
                style={styles.albumImage}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.songTitle} numberOfLines={1}>{topResult?.Name || 'Starboy'}</Text>
                <Text style={styles.artistText} numberOfLines={1}>
                  Song • {topResult?.Artists?.join(', ') || 'The Weeknd'}
                </Text>

                <TouchableOpacity style={styles.followBtn} onPress={() => { if (topResult) handlePressTrack(topResult) }}>
                  <Plus size={16} color="white" />
                  <Text style={styles.followText}>Play</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Browse All */}
          <View style={styles.section}>
            <Text style={styles.sectionMainTitle}>Browse All</Text>

            <View style={styles.grid}>
              {['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'Jazz', 'Indie'].map(
                (genre, i) => (
                  <View key={i} style={styles.genreCard}>
                    <Text style={styles.genreText}>{genre}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Global Mini Player overlay */}
      <MiniPlayer />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120814',
  },

  header: {
    padding: 20,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#b90df2',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1022',
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: 'white',
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  sectionTitle: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  sectionMainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },

  clearText: {
    color: '#b90df2',
    fontSize: 12,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1022',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    gap: 5,
  },

  chipText: {
    color: 'white',
    fontSize: 13,
  },

  topResultCard: {
    flexDirection: 'row',
    backgroundColor: '#1e1022',
    borderRadius: 16,
    padding: 15,
    gap: 15,
  },

  albumImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  artistText: {
    color: '#aaa',
    marginVertical: 5,
  },

  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#b90df2',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    gap: 5,
  },

  followText: {
    color: 'white',
    fontWeight: 'bold',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  genreCard: {
    width: '48%',
    height: 100,
    backgroundColor: '#b90df2',
    borderRadius: 15,
    justifyContent: 'center',
    paddingLeft: 15,
    marginBottom: 15,
  },

  genreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
})