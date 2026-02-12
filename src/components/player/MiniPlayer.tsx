import React from 'react'
import { View, Button } from 'react-native'
import { useDispatch } from 'react-redux'
import TrackPlayer from 'react-native-track-player'
import { nextTrack, previousTrack } from '../../stores/playerSlice'
import { AppDispatch } from '../../stores'

const MiniPlayer = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
      <Button
        title="Prev"
        onPress={async () => {
          dispatch(previousTrack())
          await TrackPlayer.skipToPrevious()
        }}
      />

      <Button
        title="Next"
        onPress={async () => {
          dispatch(nextTrack())
          await TrackPlayer.skipToNext()
        }}
      />
    </View>
  )
}

export default MiniPlayer
