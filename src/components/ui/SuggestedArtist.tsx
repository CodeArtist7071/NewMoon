import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';

interface Artist {
  Id: string;
  Name: string;
  PlayCount?: number;
  ImageTags?: {
    Primary?: string;
  };
}

const API_KEY = 'YOUR_API_KEY';

const SuggestedArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const {serverUrl,token,userid} = useSelector((state:RootState) => state.auth);

  useEffect(() => {
    fetchSuggestedArtists();
  }, []);

  const fetchSuggestedArtists = async () => {
    try {
      const response = await fetch(
        `${serverUrl}/Users/${userid}/Items?` +
          `IncludeItemTypes=MusicArtist&` +
          `Recursive=true&` +
          `SortBy=PlayCount&` +
          `SortOrder=Descending&` +
          `Fields=PlayCount&` +
          `Limit=20`,
        {
          headers: {
            'X-Emby-Token': token || API_KEY,
          },
        }
      );

      const data = await response.json();

      // Optional: remove artists with 0 plays
      const filtered = data.Items.filter(
        (item: Artist) => item.PlayCount && item.PlayCount > 0
      );

      setArtists(filtered);
    } catch (err) {
      console.log('Error fetching suggested artists:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Artist }) => {
    const imageUrl = item.ImageTags?.Primary
      ? `${serverUrl}/Items/${item.Id}/Images/Primary?maxWidth=200&api_key=${token}`
      : null;

    return (
      <TouchableOpacity style={styles.card}>
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}
        <Text style={styles.name}>{item.Name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Suggested Artists</Text>
      <FlatList
        data={artists}
        horizontal
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default SuggestedArtists;

const styles = StyleSheet.create({
  container: { paddingVertical: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginLeft: 16, marginBottom: 12 },
  card: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
});
