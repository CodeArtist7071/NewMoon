import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import RNFS from 'react-native-fs';
import { initDB, getDownloads, deleteDownload } from '../../utils/database';

interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  filePath: string;
}

const Downloads = () => {
  const [downloads, setDownloads] = useState<Song[]>([]);

  useEffect(() => {
    initDB();
    loadDownloads();
  }, []);

  const loadDownloads = () => {
    getDownloads((data: Song[]) => {
      setDownloads(data);
    });
  };

  const handleDelete = async (item: Song) => {
    try {
      await RNFS.unlink(item.filePath);
      deleteDownload(item.id);
      loadDownloads();
    } catch (err) {
      Alert.alert('Error deleting file');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Downloaded Songs</Text>

      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.artist}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(item)}
              style={styles.deleteBtn}
            >
              <Text style={{ color: 'white' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Downloads;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  title: { fontWeight: '600' },
  subtitle: { color: '#666' },
  deleteBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 6,
  },
});
