import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import Artists from "../components/Library/Artists";
import Albums from "../components/Library/Albums";
import Playlists from "../components/Library/Playlist";

const Top = createMaterialTopTabNavigator();

export const TopTabNavigator = () => {
  return (
    <Top.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#120814', elevation: 0, shadowOpacity: 0 },
        tabBarActiveTintColor: '#b90df2',
        tabBarInactiveTintColor: '#aaa',
        tabBarIndicatorStyle: { backgroundColor: '#b90df2' },
        sceneStyle: { backgroundColor: '#120814' }
      }}
    >
      <Top.Screen name="Playlists" component={Playlists} />
      <Top.Screen name="Artist" component={Artists} />
      <Top.Screen name="Albums" component={Albums} />
    </Top.Navigator>
  );
};