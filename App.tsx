import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './src/stores';
import { restoreSession } from './src/stores/authSlice';
import { AudioProvider } from './src/providers/AudioProvider';
import MiniPlayer from './src/components/player/MiniPlayer';
import AppNavigator from './src/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';


function Root() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((s: RootState) => s.auth.token);

  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AudioProvider>
          <SafeAreaProvider>
            <Root />
          </SafeAreaProvider>
        </AudioProvider>
      </Provider>
    </ThemeProvider>
  );
}
