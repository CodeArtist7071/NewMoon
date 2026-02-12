import TrackPlayer from 'react-native-track-player'
import { getStreamUrl } from '../jellyfin/playback'

export const playQueue = async (
  tracks: any[],
  startIndex: number,
  serverUrl: string,
  token: string
) => {
  await TrackPlayer.reset()

  const queue = tracks.map(track => ({
    id: track.Id,
    url: getStreamUrl(serverUrl, track.Id, token),
    title: track.Name,
    artist: track.Artists?.join(', ') || 'Unknown',
    artwork: `${serverUrl}/Items/${track.AlbumId}/Images/Primary?api_key=${token}`,
  }))

  await TrackPlayer.add(queue)
  await TrackPlayer.skip(queue[startIndex].id)
  await TrackPlayer.play()
}
