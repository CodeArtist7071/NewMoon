import { PlayIcon, PlusIcon } from 'lucide-react-native';
import React from 'react';
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SongCard } from '../components/ui/SongCard';
// import { playQueue } from '../services/player/queueController';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';

export const TrendingNow = () => {
  const { serverUrl, token } = useSelector((s: RootState) => s.auth);
  async function handlePress(item: any) {
    // await playQueue(songs, item, serverUrl!, token!);
  }
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <SongCard
        imageUrl={undefined}
        onClick={() => handlePress(item)}
        item={undefined}
      />
    );
  };

  return (
    <SafeAreaView>
      <View>
        <Image />
        <View>
          <Text></Text>
          <Text></Text>
          <View>
            <TouchableOpacity>
              <PlayIcon /> <Text></Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <PlusIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text>Tracks</Text>
        <Text>Updated 2h ago</Text>
      </View>
      <FlatList
        data={[]}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const Header = () => {
  <View></View>;
};

const UtitlitiesButton = ({ children }: any) => {
  return <TouchableOpacity>{children}</TouchableOpacity>;
};
