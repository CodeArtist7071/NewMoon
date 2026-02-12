import { getClient } from './client'

export const fetchArtists = async (userId: string) => {
  const client = getClient()
  const res = await client.get(`/Users/${userId}/Items`, {
    params: {
      IncludeItemTypes: 'MusicArtist',
      Recursive: true,
      SortBy: 'SortName',
      SortOrder: 'Ascending',
    },
  })
  return res.data.Items
}

export const fetchAlbumsByArtist = async (
  userId: string,
  artistId: string
) => {
  const client = getClient()
  const res = await client.get(`/Users/${userId}/Items`, {
    params: {
      IncludeItemTypes: 'MusicAlbum',
      ArtistIds: artistId,
      Recursive: true,
      SortBy: 'ProductionYear,SortName',
    },
  })
  return res.data.Items
}

export const fetchTracksByAlbum = async (
  userId: string,
  albumId: string
) => {
  const client = getClient()
  const res = await client.get(`/Users/${userId}/Items`, {
    params: {
      IncludeItemTypes: 'Audio',
      ParentId: albumId,
      Recursive: true,
      SortBy: 'IndexNumber',
    },
  })
  return res.data.Items
}
