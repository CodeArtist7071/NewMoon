import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { fetchTracksByArtistId } from '../services/jellyfin/library';
import { setQueue } from '../stores/playerSlice';
import { getStreamUrl } from '../services/jellyfin/playback';
import { ArrowLeftCircle, HammerIcon, Play, Verified } from 'lucide-react-native';
import MiniPlayer from '../components/player/MiniPlayer';

export const ArtistTracks = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { serverUrl, token, userid } = useSelector((s: RootState) => s.auth);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const artistId = route.params?.artistId;

  const fetchData = async () => {
    if (!artistId || !userid || !serverUrl) return;
    try {
      const response = await fetchTracksByArtistId({
        serverUrl: serverUrl,
        itemId: artistId,
        token: token,
        userid,
      });
      setTracks(response || []);
    } catch (e) {
      console.log('Error fetching artist tracks', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [artistId]);

  const handlePress = (index: number) => {
    if (!tracks || !serverUrl || !token) return;

    const formattedQueue = tracks.map((song: any) => ({
      id: song.Id,
      url: getStreamUrl(serverUrl, song.Id, token),
      title: song.Name,
      artist: song.Artists?.join(', ') || 'Unknown',
      artwork: song.AlbumId
        ? `${serverUrl}/Items/${song.AlbumId}/Images/Primary?api_key=${token}`
        : undefined,
    }));

    dispatch(setQueue({ queue: formattedQueue, startIndex: Math.max(0, index) }));
    navigation.navigate('MediaPlayer', { trackIndex: index });
  };

  const playAll = () => {
    if (tracks.length > 0) handlePress(0);
  }

  const formatDuration = (ticks: number) => {
    if (!ticks) return '0:00';
    const seconds = Math.floor(ticks / 10000000);
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#b90df2" style={{ marginTop: 50 }} />
      </SafeAreaView>
    )
  }

  // Derive artist metadata safely from the first track
  const artistName = tracks.length > 0 && tracks[0].Artists && tracks[0].Artists.length > 0
    ? tracks[0].Artists[0]
    : 'Artist Profile';

  // Extract unique albums from tracks
  const albumsMap = new Map();
  tracks.forEach(t => {
    if (t.AlbumId && !albumsMap.has(t.AlbumId)) {
      albumsMap.set(t.AlbumId, {
        id: t.AlbumId,
        title: t.Album,
        image: `${serverUrl}/Items/${t.AlbumId}/Images/Primary?api_key=${token}`,
        year: t.ProductionYear || 'Unknown'
      });
    }
  });
  const albumsList = Array.from(albumsMap.values());

  const heroImageUrl = artistId ? `${serverUrl}/Items/${artistId}/Images/Primary?maxWidth=800&api_key=${token}` : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4';

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.hero}>
            <Image
              source={{ uri: heroImageUrl }}
              style={styles.heroImage}
            />
            <View
              // colors={["transparent", "#1e1022"]}
              style={styles.heroOverlay}
            />

            <TouchableOpacity
              style={styles.backButton}
              hitSlop={15}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeftCircle size={32} color="#fff" />
            </TouchableOpacity>

            <View style={styles.heroContent}>
              <Text style={styles.artistName} numberOfLines={2}>{artistName}</Text>
              <View style={styles.listenerRow}>
                <Verified size={16} color="#b90df2" />
                <Text style={styles.listeners}>
                  {tracks.length} Total Tracks Available
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.playBtn} onPress={playAll}>
              <Play size={20} color="#fff" />
              <Text style={styles.playText}>Play All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Popular Tracks */}
          <Text style={styles.sectionTitle}>Popular</Text>

          {tracks.slice(0, 10).map((track, index) => {
            const trackImage = track.AlbumId
              ? `${serverUrl}/Items/${track.AlbumId}/Images/Primary?maxWidth=150&api_key=${token}`
              : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745';

            return (
              <TouchableOpacity key={track.Id} style={styles.trackRow} onPress={() => handlePress(index)}>
                <Text style={styles.trackIndex}>{index + 1}</Text>
                <Image source={{ uri: trackImage }} style={styles.trackImage} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.trackTitle}>{track.Name}</Text>
                  <Text style={styles.trackStreams}>{formatDuration(track.RunTimeTicks)}</Text>
                </View>
                <HammerIcon size={22} color="#777" />
              </TouchableOpacity>
            )
          })}

          {/* Discography */}
          {albumsList.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Discography</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {albumsList.map((album) => (
                  <View key={album.id} style={styles.albumCard}>
                    <Image source={{ uri: album.image }} style={styles.albumCover} />
                    <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
                    <Text style={styles.albumType}>{album.year}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              Discover {artistName}'s expansive discography securely synced from your Jellyfin media library server.
            </Text>
          </View>

          {/* Bottom Padding */}
          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Global Mini Player */}
        <MiniPlayer />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1022",
  },
  hero: {
    height: 400,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  artistName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
  },
  listenerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  listeners: {
    color: "#b90df2",
    marginLeft: 6,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  playBtn: {
    flex: 1,
    backgroundColor: "#b90df2",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  playText: {
    color: "#fff",
    fontWeight: "bold",
  },
  followBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#b90df2",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  followText: {
    color: "#fff",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  trackIndex: {
    width: 25,
    color: "#777",
  },
  trackImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginHorizontal: 10,
    backgroundColor: '#333'
  },
  trackTitle: {
    color: "#fff",
    fontWeight: "600",
  },
  trackStreams: {
    color: "#888",
    fontSize: 12,
    marginTop: 2
  },
  albumCard: {
    width: 140,
    marginLeft: 20,
  },
  albumCover: {
    width: "100%",
    height: 140,
    backgroundColor: "#333",
    borderRadius: 14,
  },
  albumTitle: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
  },
  albumType: {
    color: "#777",
    fontSize: 12,
  },
  aboutCard: {
    backgroundColor: "#2a1430",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
  },
  aboutText: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
});