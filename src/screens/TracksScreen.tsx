import React, { useEffect } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { loadTracks } from '../stores/librarySlice'
import { RootState, AppDispatch } from '../stores'
import { playSingleTrack } from '../services/player/playerController'
import { setQueue } from '../stores/playerSlice'
import { playQueue } from '../services/player/queueController'
import MiniPlayer from '../components/player/MiniPlayer'


export default function TracksScreen({ route }: any) {
  const { albumId } = route.params
  const dispatch = useDispatch<AppDispatch>()
  const { userId } = useSelector((s: RootState) => s.auth)
  const tracks = useSelector(
    (s: RootState) => s.library.tracksByAlbum[albumId] || []
  )
  const { serverUrl, token } = useSelector((s: RootState) => s.auth)

  useEffect(() => {
    dispatch(loadTracks({ userId, albumId }))
  }, [])

  return (
    <>
       <FlatList
      data={tracks}
      keyExtractor={(item: any) => item.Id}
     renderItem={({ item, index }: any) => (
  <TouchableOpacity
    onPress={() => {
      dispatch(
        setQueue({
          queue: tracks,
          startIndex: index,
        })
      )

      playQueue(tracks, index, serverUrl!, token!)
    }}
  >
    <Text style={{ padding: 16 }}>
      ▶ {item.IndexNumber}. {item.Name}
    </Text>
  </TouchableOpacity>
)}
    />
    <View style={{ marginTop: 20 }}>
  <MiniPlayer />
</View>
    </>
 
  )
}
