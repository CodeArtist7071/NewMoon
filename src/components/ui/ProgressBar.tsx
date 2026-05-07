import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from 'react-native';

interface Props {
  position: number;
  duration: number;
  onSeek: (value: number) => void;
}

const ProgressBar: React.FC<Props> = ({
  position,
  duration,
  onSeek,
}) => {
  const barWidth = useRef(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  // Update progress when not dragging
  useEffect(() => {
    if (!isDragging && duration > 0 && barWidth.current > 0) {
      const percentage = position / duration;
      Animated.timing(progressAnim, {
        toValue: percentage * barWidth.current,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [position, duration, isDragging]);

  const onLayout = (event: LayoutChangeEvent) => {
    barWidth.current = event.nativeEvent.layout.width;
  };

  const updateDrag = (x: number) => {
    const clamped = Math.max(0, Math.min(x, barWidth.current));
    setDragX(clamped);
    progressAnim.setValue(clamped);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: evt => {
        setIsDragging(true);
        updateDrag(evt.nativeEvent.locationX);
      },

      onPanResponderMove: evt => {
        updateDrag(evt.nativeEvent.locationX);
      },

      onPanResponderRelease: () => {
        setIsDragging(false);
        const percentage = dragX / barWidth.current;
        const seekPosition = percentage * duration;
        onSeek(seekPosition); // 🔥 Seek only once
      },
    })
  ).current;

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      <View style={styles.track} />

      <Animated.View
        style={[
          styles.progress,
          { width: progressAnim },
        ]}
      />

      <Animated.View
        style={[
          styles.thumb,
          { left: Animated.subtract(progressAnim, 8) },
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: '99%',
    height: 30,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    height: 3,
    width: '100%',
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  progress: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#1DB954',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1DB954',
    top: 7,
  },
});
