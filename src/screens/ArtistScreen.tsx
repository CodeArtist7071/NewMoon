import React, { useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { loadArtists } from '../stores/librarySlice'
import { RootState, AppDispatch } from '../stores'

export default function ArtistScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>()
  const { userId } = useSelector((s: RootState) => s.auth)
  const artists = useSelector((s: RootState) => s.library.artists)

  useEffect(() => {
    if (userId) dispatch(loadArtists(userId))
  }, [userId])

  return (
    <FlatList
      data={artists}
      keyExtractor={(item: any) => item.Id}
      renderItem={({ item }: any) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Albums', { artistId: item.Id })
          }
        >
          <Text style={{ padding: 16 }}>{item.Name}</Text>
        </TouchableOpacity>
      )}
    />
  )
}
