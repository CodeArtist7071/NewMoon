import React, { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store, RootState, AppDispatch } from './src/stores'
import LoginScreen from './src/screens/LoginScreen'
import HomeScreen from './src/screens/HomeScreen'
import { restoreSession } from './src/stores/authSlice'
import { setupPlayer } from './src/services/player/setupPlayer'
import { registerTrackEvents } from './src/services/player/events'
import MiniPlayer from './src/components/player/MiniPlayer'


function Root() {

  useEffect(() => {
  registerTrackEvents()
  setupPlayer()
}, [])

  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector((s: RootState) => s.auth.token)

  useEffect(() => {
    dispatch(restoreSession())
  }, [])

  return (
    <>
    {token ? <HomeScreen /> : <LoginScreen />}
    {token && <MiniPlayer />}
    </>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  )
}
