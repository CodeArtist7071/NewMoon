import React, { useEffect } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { loadAlbums } from '../stores/librarySlice'
import { RootState, AppDispatch } from '../stores'

export default function AlbumScreen({ route, navigation }: any) {
  const { artistId } = route.params
  const dispatch = useDispatch<AppDispatch>()
  const { userId } = useSelector((s: RootState) => s.auth)
  const albums = useSelector(
    (s: RootState) => s.library.albumsByArtist[artistId] || []
  )

  useEffect(() => {
    dispatch(loadAlbums({ userId, artistId }))
  }, [])

  return (
    <FlatList
      data={albums}
      keyExtractor={(item: any) => item.Id}
      renderItem={({ item }: any) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Tracks', { albumId: item.Id })
          }
        >
          <Text style={{ padding: 16 }}>{item.Name}</Text>
        </TouchableOpacity>
      )}
    />
  )
}
