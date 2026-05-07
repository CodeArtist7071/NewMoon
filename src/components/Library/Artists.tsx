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
import { fetchArtists } from '../../services/jellyfin/library';
import { useNavigation } from '@react-navigation/native';

export interface Artist {
  Name: string;
  Id: string;
  ImageTags?: Record<string, string>;
}

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const { serverUrl, token, userid } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    if (!userid) return;
    try {
      const data = await fetchArtists({ userId: userid, token, serverUrl });
      setArtists(data.Items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Artist }) => {
    const imageUrl = item.ImageTags?.Primary
      ? `${serverUrl}/Items/${item.Id}/Images/Primary?maxWidth=150&api_key=${token}`
      : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=150';

    return (
      <TouchableOpacity
        style={styles.artistItem}
        onPress={() =>
          navigation.navigate('ArtistTracks', { artistId: item.Id })
        }
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.artistCircle}
        />
        <Text style={styles.artistName} numberOfLines={1}>{item.Name}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={'#b90df2'} style={{ marginTop: 50 }} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={artists}
        keyExtractor={item => item.Id}
        renderItem={renderItem}
        numColumns={3}
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 20 }}
      />
    </View>
  );
};

export default Artists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120814',
  },
  artistItem: {
    alignItems: "center",
    width: 90,
  },
  artistCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
    marginBottom: 8,
  },
  artistName: {
    color: "#fff",
    fontSize: 12,
    textAlign: 'center',
  },
});
