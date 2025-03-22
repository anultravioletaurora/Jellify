import './gesture-handler';
import React, { useState } from 'react';
import "react-native-url-polyfill/auto";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import Jellify from './components/jellify';
import { TamaguiProvider, Theme } from 'tamagui';
import { useColorScheme } from 'react-native';
import jellifyConfig from './tamagui.config';
import { clientPersister } from './constants/storage';
import { queryClient } from './constants/query-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer, { IOSCategory, IOSCategoryOptions } from 'react-native-track-player';
import { CAPABILITIES } from './player/constants';
import { createWorkletRuntime } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { JellifyDarkTheme, JellifyLightTheme } from './components/theme';

export const backgroundRuntime = createWorkletRuntime('background');

export default function App(): React.JSX.Element {
  
  const [playerIsReady, setPlayerIsReady] = useState<boolean>(false);
  const isDarkMode = useColorScheme() === 'dark';

  TrackPlayer.setupPlayer({
    autoHandleInterruptions: true,
    maxCacheSize: 1000 * 100, // 100MB, TODO make this adjustable
    iosCategory: IOSCategory.Playback,
    iosCategoryOptions: [
        IOSCategoryOptions.AllowAirPlay,
        IOSCategoryOptions.AllowBluetooth,
    ]
  })
  .then(() => TrackPlayer.updateOptions({
    progressUpdateEventInterval: 1,
    capabilities: CAPABILITIES,
    notificationCapabilities: CAPABILITIES,
    compactCapabilities: CAPABILITIES,
    // ratingType: RatingType.Heart,
    // likeOptions: {
    //     isActive: false,
    //     title: "Favorite"
    // },
    // dislikeOptions: {
    //     isActive: true,
    //     title: "Unfavorite"
    // }
  }))
  .finally(() => {
    setPlayerIsReady(true);
  });

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDarkMode ? JellifyDarkTheme : JellifyLightTheme}>

      <PersistQueryClientProvider 
        client={queryClient} 
        persistOptions={{ 
          persister: clientPersister,
      }}>
        <GestureHandlerRootView>
          <TamaguiProvider config={jellifyConfig}>
            <Theme name={isDarkMode ? 'dark' : 'light'}>
              { playerIsReady && (
                <Jellify />
              )}
            </Theme>
          </TamaguiProvider>
        </GestureHandlerRootView>
      </PersistQueryClientProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}