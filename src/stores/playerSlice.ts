import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface PlayerState {
  queue: any[]
  currentIndex: number
  sleepTimerTimestamp: number | null
  sleepTimerDuration: string | null
}

const initialState: PlayerState = {
  queue: [],
  currentIndex: -1,
  sleepTimerTimestamp: null,
  sleepTimerDuration: null,
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
    clearSleepTimer(state) {
      state.sleepTimerTimestamp = null
      state.sleepTimerDuration = null
    },
    setSleepTimer(state, action: PayloadAction<{ timestamp: number; duration: string }>) {
      state.sleepTimerTimestamp = action.payload.timestamp
      state.sleepTimerDuration = action.payload.duration
    }
  },
})

export const { setQueue, nextTrack, previousTrack, clearSleepTimer, setSleepTimer } =
  playerSlice.actions
export default playerSlice.reducer
