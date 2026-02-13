import TrackPlayer, { Event } from '@jamsch/react-native-track-player'


module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play()
  })

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause()
  })
}
