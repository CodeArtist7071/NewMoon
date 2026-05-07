import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { RootState } from '../../stores';
import { useSelector } from 'react-redux';

  import { useFocusEffect } from '@react-navigation/native';
  import { useCallback } from 'react';

interface Playlist {
  Id: string;
  Name: string;
  ImageTags?: { Primary?: string };
}

const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { serverUrl, token, userid } = useSelector((state: RootState) => state.auth);


  useFocusEffect(
    useCallback(() => {
      fetchPlaylists();
    }, [userid])
  );

  const fetchPlaylists = async () => {
    if (!userid) return;
    try {
      const res = await fetch(
        `${serverUrl}/Users/${userid}/Items?IncludeItemTypes=Playlist`,
        { headers: { 'X-Emby-Token': token || 'undefined' } }
      );

      const data = await res.json();
      setPlaylists(data.Items || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color={'#b90df2'} style={{ marginTop: 50 }} /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.Id}
        numColumns={2}
        contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => {
          const imageUrl = item.ImageTags?.Primary
            ? `${serverUrl}/Items/${item.Id}/Images/Primary?maxWidth=300&api_key=${token}`
            : 'https://images.unsplash.com/photo-1614680376593-902f74a5cecb?auto=format&fit=crop&q=80&w=300';

          return (
            <TouchableOpacity style={styles.playlistItem}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.playlistImage}
              />
              <Text style={styles.playlistTitle} numberOfLines={1}>{item.Name}</Text>
              <Text style={styles.playlistSub}>By You</Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  );
};

export default Playlists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120814',
  },
  playlistItem: {
    width: "48%",
    marginBottom: 20,
  },
  playlistImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    backgroundColor: '#333'
  },
  playlistTitle: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 6,
  },
  playlistSub: {
    color: "#aaa",
    fontSize: 12,
  },
});