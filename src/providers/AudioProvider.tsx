import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Video, { OnProgressData, OnLoadData } from 'react-native-video';
import { RootState } from '../stores';
import { nextTrack, previousTrack, setQueue, clearSleepTimer } from '../stores/playerSlice';

interface AudioContextType {
    isPlaying: boolean;
    position: number;
    duration: number;
    repeatMode: 'off' | 'track' | 'queue';
    shuffle: boolean;
    play: () => void;
    pause: () => void;
    seekTo: (seconds: number) => void;
    toggleRepeat: () => void;
    toggleShuffle: () => void;
    playPause: () => void;
    skipToNext: () => void;
    skipToPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioContext must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { queue, currentIndex } = useSelector((state: RootState) => state.player);

    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'queue'>('off');
    const [shuffle, setShuffle] = useState(false);

    const [originalQueue, setOriginalQueue] = useState<any[]>([]);

    const videoRef = useRef<any>(null);

    // When a new track is selected, start playing
    useEffect(() => {
        if (queue.length > 0 && currentIndex !== -1) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
        }
    }, [currentIndex, queue]);

    // Handle Sleep Timer locally via background interval polling vs Redux threshold
    const { sleepTimerTimestamp, sleepTimerDuration } = useSelector((state: RootState) => state.player);

    useEffect(() => {
        if (!sleepTimerTimestamp) return;

        const interval = setInterval(() => {
            if (Date.now() >= sleepTimerTimestamp) {
                // Timer finished!
                setIsPlaying(false);
                dispatch(clearSleepTimer());
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [sleepTimerTimestamp, dispatch]);

    const activeTrack = queue[currentIndex] || null;

    const play = () => setIsPlaying(true);
    const pause = () => setIsPlaying(false);
    const playPause = () => setIsPlaying(!isPlaying);

    const seekTo = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.seek(seconds);
            setPosition(seconds);
        }
    };

    const skipToNext = () => {
        if (repeatMode === 'track') {
            seekTo(0);
            play();
            return;
        }
        dispatch(nextTrack());
    };

    const skipToPrevious = () => {
        dispatch(previousTrack());
    };

    const toggleRepeat = () => {
        setRepeatMode(prev => prev === 'off' ? 'track' : prev === 'track' ? 'queue' : 'off');
    };

    const toggleShuffle = () => {
        if (!shuffle) {
            // Turn on shuffle
            setOriginalQueue([...queue]);
            const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);
            // Keep current track at index 0 of shuffled queue
            if (activeTrack) {
                const withoutActive = shuffledQueue.filter(t => t.id !== activeTrack.id);
                dispatch(setQueue({ queue: [activeTrack, ...withoutActive], startIndex: 0 }));
            } else {
                dispatch(setQueue({ queue: shuffledQueue, startIndex: 0 }));
            }
            setShuffle(true);
        } else {
            // Turn off shuffle
            const activeId = activeTrack?.id;
            const newIndex = originalQueue.findIndex(t => t.id === activeId);
            dispatch(setQueue({ queue: originalQueue, startIndex: Math.max(0, newIndex) }));
            setShuffle(false);
        }
    };

    const onProgress = (data: OnProgressData) => {
        setPosition(data.currentTime);
    };

    const onLoad = (data: OnLoadData) => {
        setDuration(data.duration);
        setPosition(0);
    };

    const onEnd = () => {
        if (repeatMode === 'track') {
            seekTo(0);
            play();
        } else if (repeatMode === 'queue' && currentIndex === queue.length - 1) {
            dispatch(setQueue({ queue, startIndex: 0 }));
        } else if (currentIndex < queue.length - 1) {
            dispatch(nextTrack());
        } else {
            setIsPlaying(false);
            setPosition(0);
        }
    };

    const onError = (error: any) => {
        console.error('Video Error:', error);
        setIsPlaying(false);
    };

    return (
        <AudioContext.Provider value={{
            isPlaying, position, duration, repeatMode, shuffle,
            play, pause, seekTo, toggleRepeat, toggleShuffle, playPause,
            skipToNext, skipToPrevious
        }}>
            {children}
            {activeTrack && activeTrack.url && (
                <Video
                    ref={videoRef}
                    source={{ uri: activeTrack.url }}
                    ignoreSilentSwitch="ignore"
                    playInBackground={true}
                    playWhenInactive={true}
                    paused={!isPlaying}
                    onProgress={onProgress}
                    onLoad={onLoad}
                    onEnd={onEnd}
                    onError={onError}
                    progressUpdateInterval={250}
                    style={{ width: 0, height: 0 }}
                />
            )}
        </AudioContext.Provider>
    );
};
