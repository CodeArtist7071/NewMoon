import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlayerState {
  queue: any[]
  currentIndex: number
}

const initialState: PlayerState = {
  queue: [],
  currentIndex: -1,
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setQueue(
      state,
      action: PayloadAction<{ queue: any[]; startIndex: number }>
    ) {
      state.queue = action.payload.queue
      state.currentIndex = action.payload.startIndex
    },
    nextTrack(state) {
      if (state.currentIndex < state.queue.length - 1) {
        state.currentIndex += 1
      }
    },
    previousTrack(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1
      }
    },
  },
})

export const { setQueue, nextTrack, previousTrack } =
  playerSlice.actions
export default playerSlice.reducer
