import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchArtists,
  fetchAlbumsByArtist,
  fetchTracksByAlbum,
} from '../services/jellyfin/library'

export const loadArtists = createAsyncThunk(
  'library/loadArtists',
  async (userId: string) => {
    return await fetchArtists(userId)
  }
)

export const loadAlbums = createAsyncThunk(
  'library/loadAlbums',
  async ({ userId, artistId }: any) => {
    return {
      artistId,
      albums: await fetchAlbumsByArtist(userId, artistId),
    }
  }
)

export const loadTracks = createAsyncThunk(
  'library/loadTracks',
  async ({ userId, albumId }: any) => {
    return {
      albumId,
      tracks: await fetchTracksByAlbum(userId, albumId),
    }
  }
)

const librarySlice = createSlice({
  name: 'library',
  initialState: {
    artists: [],
    albumsByArtist: {} as Record<string, any[]>,
    tracksByAlbum: {} as Record<string, any[]>,
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadArtists.pending, state => {
        state.loading = true
      })
      .addCase(loadArtists.fulfilled, (state, action) => {
        state.artists = action.payload
        state.loading = false
      })
      .addCase(loadAlbums.fulfilled, (state, action) => {
        state.albumsByArtist[action.payload.artistId] =
          action.payload.albums
      })
      .addCase(loadTracks.fulfilled, (state, action) => {
        state.tracksByAlbum[action.payload.albumId] =
          action.payload.tracks
      })
  },
})

export default librarySlice.reducer
