import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProgressBar from '../ui/ProgressBar';
import { CirclePause, CirclePlay } from 'lucide-react-native';
import { useAudioContext } from '../../providers/AudioProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';

const MiniPlayer = () => {
  const { isPlaying, playPause, position, duration, seekTo } = useAudioContext();
  const navigation = useNavigation<any>();
  const { queue, currentIndex } = useSelector((state: RootState) => state.player);

  const activeTrack = queue[currentIndex];

  if (!activeTrack) return null;

  const togglePlayback = () => {
    playPause();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.mainContainer}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('MediaPlayer')}
      >
        <ProgressBar
          position={position}
          duration={duration}
          onSeek={(value) => seekTo(value)}
        />
        <View style={styles.container}>
          <View style={styles.info}>
            <Text numberOfLines={1} style={styles.title}>
              {activeTrack.title}
            </Text>
            <Text numberOfLines={1} style={styles.artist}>
              {activeTrack.artist}
            </Text>
          </View>
          <TouchableOpacity onPress={togglePlayback}>
            <Text style={styles.play}>
              {isPlaying ? (
                <CirclePause size={28} color={'#fff'} />
              ) : (
                <CirclePlay size={28} color={'#fff'} />
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default MiniPlayer;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: '#b90df2',
    flexDirection: 'column',
    borderRadius: 12,
    marginHorizontal: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    // borderTopWidth: 0.5,
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },

  timeRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  time: {
    fontSize: 12,
    color: '#666',
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
  },
  play: {
    fontSize: 24,
    color: '#fff',
  },
});
