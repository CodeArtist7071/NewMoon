import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';

interface Song {
  Id: string;
  Name: string;
  Album: string;
  PlayCount?: number;
  ImageTags?: {
    Primary?: string;
  };
}

const JELLYFIN_URL = 'http://YOUR_SERVER_IP:8096';
const USER_ID = 'YOUR_USER_ID';
const API_KEY = 'YOUR_API_KEY';

const TrendingNow = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const {serverUrl,token,userid} = useSelector((state:RootState) => state.auth);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/Users/${userid}/Items?` +
          `IncludeItemTypes=Audio&` +
          `Recursive=true&` +
          `SortBy=PlayCount&` +
          `SortOrder=Descending&` +
          `Fields=PlayCount&` +
          `Limit=30`,
        {
          headers: {
            'X-Emby-Token': token || API_KEY,
          },
        }
      );

      const data = await response.json();

      // Remove songs with 0 plays (optional)
      const filtered = data.Items.filter(
        (item: Song) => item.PlayCount && item.PlayCount > 0
      );

      setSongs(filtered);
    } catch (err) {
      console.log('Error fetching trending songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Song }) => {
    const imageUrl = item.ImageTags?.Primary
      ? `${serverUrl}/Items/${item.Id}/Images/Primary?maxWidth=200&api_key=${token || API_KEY}`
      : null;

    return (
      <View style={styles.card}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.Name}</Text>
          <Text style={styles.subtitle}>{item.Album}</Text>
          <Text style={styles.playCount}>
            🔥 {item.PlayCount ?? 0} plays
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trending Now</Text>
      <FlatList
        data={songs}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default TrendingNow;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 6,
  },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 14, color: '#666' },
  playCount: { fontSize: 12, color: '#ff5722', marginTop: 4 },
});
