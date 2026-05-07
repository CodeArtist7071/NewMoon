import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSelector } from 'react-redux'

import TracksScreen from '../screens/TracksScreen'
import ArtistScreen from '../screens/ArtistScreen'
import AlbumScreen from '../screens/AlbumScreen'
import MediaPlayer from '../screens/MediaPlayer'
import LoginScreen from '../screens/LoginScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { LibraryScreen } from '../screens/LibraryScreen'
import SearchScreen from '../screens/SearchScreen'
import SettingsScreen from '../screens/SettingsScreen'
import { ArtistTracks } from '../screens/ArtistTracks'
import TrendingNow from '../components/ui/TrendingNow'
import CreatePlaylistScreen from '../screens/CreatePlaylistScreen'
import { loadSession } from '../utils/session'

const Stack = createNativeStackNavigator()

const AppNavigator = () => {
  const initialToken = useSelector((s: any) => s.auth.token)
  const status = useSelector((s: any) => s.auth.status)
  const {token, userid, serverUrl} = loadSession() ?? {};
   console.log(loadSession());
  /* 🟣 Show Loader While Checking Auth */
  if (status === 'loading') {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#b90df2" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token || initialToken ? (
        <>
          <Stack.Screen name="Home" component={DashboardScreen} />
          <Stack.Screen name="Artists" component={ArtistScreen} />
          <Stack.Screen name="Albums" component={AlbumScreen} />
          <Stack.Screen name="Tracks" component={TracksScreen} />
          <Stack.Screen name="ArtistTracks" component={ArtistTracks} />
          <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
          <Stack.Screen name="TrendingNow" component={TrendingNow} />
          <Stack.Screen name="MediaPlayer" component={MediaPlayer} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Library" component={LibraryScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#1e1022',
    justifyContent: 'center',
    alignItems: 'center',
  },
})