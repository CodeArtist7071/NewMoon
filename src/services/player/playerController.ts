import TrackPlayer from '@jamsch/react-native-track-player'
import { getStreamUrl } from '../jellyfin/playback'

export const playSingleTrack = async (
  track: any,
  serverUrl: string,
  token: string
) => {
  await TrackPlayer.reset()

  await TrackPlayer.add({
    id: track.Id,
    url: getStreamUrl(serverUrl, track.Id, token),
    title: track.Name,
    artist: track.Artists?.join(', ') || 'Unknown',
    artwork: `${serverUrl}/Items/${track.AlbumId}/Images/Primary?api_key=${token}`,
  })

  await TrackPlayer.play()
}
