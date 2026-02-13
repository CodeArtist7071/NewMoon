import TrackPlayer, { Event } from '@jamsch/react-native-track-player'
import { store } from '../../stores'
import { nextTrack } from '../../stores/playerSlice'

export const registerTrackEvents = () => {
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
    store.dispatch(nextTrack())
  })
}
