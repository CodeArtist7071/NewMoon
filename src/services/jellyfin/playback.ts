export const getStreamUrl = (
  serverUrl: string,
  trackId: string,
  token: string
) => {
  return `${serverUrl}/Audio/${trackId}/stream?Static=true&MaxStreamingBitrate=320000&api_key=${token}`
}
