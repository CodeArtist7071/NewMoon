export const getStreamUrl = (
  serverUrl: string,
  trackId: string,
  token: string
) => {
  return `${serverUrl}/Audio/${trackId}/stream?api_key=${token}`
}
