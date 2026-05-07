import { getClient } from './client'

interface Data {
  userId: string;
  token: string | null;
  serverUrl: string | null;
}

import axios from 'axios'
import { RootState, store } from '../../stores'
import { User } from 'lucide-react-native';
import { useSelector } from 'react-redux';

export const fetchAllTracks = async ({ userId, token, serverUrl }: Data) => {

  if (!token || !serverUrl) {
    throw new Error('Auth data missing')
  }

  try {
    const response = await axios.get(
      `${serverUrl}/Users/${userId}/Items`,
      {
        params: {
          IncludeItemTypes: 'Audio',
          Recursive: true,
        },
        headers: {
          'X-Emby-Token': token,
          'Content-Type': 'application/json',
        },
      }
    )

    return response.data.Items
  } catch (error: any) {
    console.log('FETCH TRACKS ERROR:', error.response?.data)
    throw error
  }
}

// const res = await fetch(
//   `${serverUrl}/Users/${userid}/Items?` +
//     `IncludeItemTypes=MusicArtist&Recursive=true&SortBy=SortName`,
//   { headers: { 'X-Emby-Token': token || API_KEY } }
// );


export const fetchArtists = async ({ userId, token, serverUrl }: Data) => {
  console.log('FETCHING ARTISTS WITH:', { userId, serverUrl, token })
  if (!token || !serverUrl) {
    throw new Error('Auth data missing')
  }

  try {
    const response = await axios.get(
      `${serverUrl}/Artists`,
      {
        headers: {
          'X-Emby-Token': token,
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('ARTISTS RESPONSE STATUS:', response.status)
    console.log('ARTISTS RESPONSE DATA:', response.data)
    return response.data
  } catch (error: any) {
    console.log('FETCH ARTISTS ERROR:', error.response?.data)
    throw error
  }
}


//   export const fetchTracksByArtistId = async ({itemId}:any) => {
//   const {userid,token,serverUrl} = useSelector((s: RootState) => s.auth)
//   if (!itemId) {
//     throw new Error('Artist ID is required to fetch tracks')
//   }

//   try {
//     const response = await axios.get(
//       `${serverUrl}/Artists/${itemId}`,
//       {
//         // params:{
//         //   IncludeItemTypes:'Audio',
//         //   ArtistIds:itemId,
//         //   Recursive:true,
//         //   SortBy:'SortName'
//         // },
//         headers: {
//           'X-Emby-Token': token,
//           'Content-Type': 'application/json',
//         },
//       }
//     )
//     const res = await fetchAllTracks({serverUrl,token,userId:userid!})
//     const data = response.data.Items
//     console.log('ARTISTS RESPONSE STATUS:', response.status)
//     console.log('ARTISTS RESPONSE DATA:', response.data)
//     return response.data
//   } catch (error: any) {
//     console.log('FETCH ARTISTS ERROR:', error.response?.data)
//     throw error
//   }
// }



export const fetchTracksByArtistId = async ({ userid, token, serverUrl, itemId }: any) => {

  if (!itemId) {
    throw new Error('Artist ID is required to fetch tracks')
  }

  try {
    const res = await fetchAllTracks({
      serverUrl,
      token,
      userId: userid!,
    })
    console.log("artist", res)
    // Find matching artist by id
    const matchedTracks = res.filter((track: any) =>
      track.ArtistItems?.some(
        (artist: any) => String(artist.Id) === String(itemId)
      )
    )

    console.log('Matched Artist:', matchedTracks)

    return matchedTracks

  } catch (error: any) {
    console.log('FETCH ARTISTS ERROR:', error.response?.data)
    throw error
  }
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

export const fetchAllLibraries = async (userId: string) => {
  const client = getClient()

  try {
    const res = await client.get(`/Users/${userId}/Views`)

    // Optional: filter only music libraries
    const musicLibraries = res.data.Items.filter(
      (item: any) => item.CollectionType === 'music'
    )

    return musicLibraries
  } catch (error: any) {
    console.log('FETCH LIBRARIES ERROR:', error.response?.data)
    throw error
  }
}

export const createPlaylist = async ({ name, userId, token, serverUrl }: any) => {
  if (!token || !serverUrl) throw new Error('Auth data missing');
  try {
    const response = await axios.post(
      `${serverUrl}/Playlists`,
      {},
      {
        params: {
          Name: name,
          UserId: userId,
          MediaType: 'Audio',
        },
        headers: {
          'X-Emby-Token': token,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.log('CREATE PLAYLIST ERROR:', error.response?.data);
    throw error;
  }
};