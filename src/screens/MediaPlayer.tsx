import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useAudioContext } from '../providers/AudioProvider';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import ProgressBar from '../components/ui/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlignLeft, ArrowLeftCircle, FastForward, Forward, Pause, Play, Repeat, Repeat1, Settings, Shuffle, SkipBack, SkipForward } from 'lucide-react-native';

export default function MediaPlayer() {
  const navigation = useNavigation();
  const { queue, currentIndex } = useSelector((state: RootState) => state.player);
  const activeTrack = queue[currentIndex];

  const {
    isPlaying,
    position,
    duration,
    repeatMode,
    shuffle,
    playPause,
    seekTo,
    toggleRepeat,
    toggleShuffle,
    skipToNext,
    skipToPrevious
  } = useAudioContext();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const queueLength = queue.length;
  const prevDisabled = queueLength <= 1 || currentIndex === 0;
  const nextDisabled = queueLength <= 1 || currentIndex === queueLength - 1;

  if (!activeTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>⌄</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>No track playing.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>
            <ArrowLeftCircle color={"white"} size={20}/>
          </Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.playingFrom}>PLAYING FROM PLAYLIST</Text>
          <Text style={styles.playlistName}>Current Queue</Text>
        </View>

        <Text style={styles.headerIcon}>
          <Settings color={"white"} size={20}/>
        </Text>
      </View>

      {/* Album Art */}
      <View style={styles.albumWrapper}>
        <Image
          source={{ uri: activeTrack.artwork || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4' }}
          style={styles.albumArt}
        />
      </View>

      {/* Track Info */}
      <View style={styles.trackInfo}>
        <Text style={styles.title}>{activeTrack.title}</Text>
        <Text style={styles.artist}>{activeTrack.artist}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <ProgressBar
          position={position}
          duration={duration}
          onSeek={(value) => seekTo(value)}
        />

        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleShuffle}>
          <Text style={[styles.icon, shuffle && { color: '#b90df2' }]}>
            <Shuffle color={"white"} size={20}/>
          </Text>
        </TouchableOpacity>

        <View style={styles.mainControls}>
          <TouchableOpacity disabled={prevDisabled} onPress={skipToPrevious}>
            <Text style={[styles.iconLarge, prevDisabled && { opacity: 0.3 }]}><SkipBack color={"white"} size={20}/></Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton} onPress={playPause}>
            <Text style={styles.playIcon}>{isPlaying ? <Pause color={"white"} size={20}/> : <Play color={"white"} size={20}/>}</Text>
          </TouchableOpacity>

          <TouchableOpacity disabled={nextDisabled} onPress={skipToNext}>
            <Text style={[styles.iconLarge, nextDisabled && { opacity: 0.3 }]}><SkipForward color={"white"} size={20}/></Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={toggleRepeat}>
          <Text style={[
            styles.icon,
            repeatMode !== 'off' && { color: '#b90df2' }
          ]}>
            {repeatMode === 'track' ? <Repeat1 color={"white"} size={20}/> : <Repeat color={"white"} size={20}/>}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  headerIcon: {
    fontSize: 24,
    color: '#aaa',
  },

  playingFrom: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 2,
  },

  playlistName: {
    fontSize: 14,
    color: '#ccc',
  },

  albumWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },

  albumArt: {
    width: 280,
    height: 280,
    borderRadius: 20,
  },

  trackInfo: {
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  artist: {
    fontSize: 16,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
  },

  progressSection: {
    marginTop: 20,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  time: {
    fontSize: 12,
    color: '#666',
  },

  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },

  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },

  icon: {
    fontSize: 20,
    color: '#888',
  },

  iconLarge: {
    fontSize: 30,
    color: '#fff',
  },

  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#b90df2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playIcon: {
    fontSize: 28,
    color: '#fff',
  },
});