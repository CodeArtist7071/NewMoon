import TrackPlayer, { Capability } from '@jamsch/react-native-track-player'

export const setupPlayer = async () => {
  await TrackPlayer.setupPlayer()

  await TrackPlayer.updateOptions({
    // stopWithApp: false,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.Stop,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
    ],
  })
}
