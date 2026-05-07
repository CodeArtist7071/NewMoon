import React from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

export const SongCard = ({imageUrl,onClick,item}:{imageUrl:any,onClick:()=>void,item:any}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onClick}>
      {imageUrl && <Image source={ typeof imageUrl === "string"
      ? { uri: imageUrl }
      : imageUrl } style={[styles.image,typeof imageUrl === "string" ? {objectFit:'fill'}:null]} />}
      <View>
        <Text style={styles.title}>{item.Name}</Text>
        <Text style={styles.subtitle}>{item.Album}</Text>
      </View>
    </TouchableOpacity>
  );
};

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
});
