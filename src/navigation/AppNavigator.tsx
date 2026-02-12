import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TracksScreen from '../screens/TracksScreen'
import ArtistScreen from '../screens/ArtistScreen'
import AlbumScreen from '../screens/AlbumScreen'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Artists" component={ArtistScreen} />
      <Stack.Screen name="Albums" component={AlbumScreen} />
      <Stack.Screen name="Tracks" component={TracksScreen} />
    </Stack.Navigator>
  )
}
