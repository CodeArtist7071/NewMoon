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
import { RootState } from '../../stores';
import { useSelector } from 'react-redux';

interface Album {
  Id: string;
  Name: string;
  AlbumArtist?: string;
  ImageTags?: { Primary?: string };
}

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { serverUrl, token, userid } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    if (!userid) return;
    try {
      const res = await fetch(
        `${serverUrl}/Users/${userid}/Items?IncludeItemTypes=MusicAlbum&Recursive=true&SortBy=SortName`,
        { headers: { 'X-Emby-Token': token || 'undefined' } }
      );

      const data = await res.json();
      setAlbums(data.Items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Album }) => {
    const imageUrl = item.ImageTags?.Primary
      ? `${serverUrl}/Items/${item.Id}/Images/Primary?maxWidth=300&api_key=${token}`
      : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300';

    return (
      <TouchableOpacity style={styles.albumItem}>
        <Image source={{ uri: imageUrl }} style={styles.albumImage} />
        <Text style={styles.albumTitle} numberOfLines={1}>{item.Name}</Text>
        <Text style={styles.albumSub} numberOfLines={1}>{item.AlbumArtist || 'Unknown Artist'}</Text>
      </TouchableOpacity>
    );
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={'#b90df2'} style={{ marginTop: 50 }} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.Id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
      />
    </View>
  );
};

export default Albums;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120814',
  },
  albumItem: {
    width: "48%",
    marginBottom: 20,
  },
  albumImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: '#333'
  },
  albumTitle: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 6,
  },
  albumSub: {
    color: "#aaa",
    fontSize: 12,
  },
});
