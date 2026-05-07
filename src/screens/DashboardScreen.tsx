import React from 'react';
import HomeScreen from './HomeScreen';
import { BottomNavigator } from '../navigation/BottomNavigator';
import MiniPlayer from '../components/player/MiniPlayer';
import { View } from 'react-native';

export const DashboardScreen = () => {
  return (
    <>
      {/* <View style={{ position: 'absolute', bottom: 70, left: 0,right: 0,zIndex:2 }}>
        <MiniPlayer />
      </View> */}
      <BottomNavigator />
    </>
  );
};
