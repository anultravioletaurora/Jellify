import './gesture-handler';
import React from 'react';
import "react-native-url-polyfill/auto";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import Jellify from './components/jellify';
import { TamaguiProvider, Theme } from 'tamagui';
import { useColorScheme } from 'react-native';
import jellifyConfig from './tamagui.config';
import { clientPersister } from './constants/storage';
import { queryClient } from './constants/query-client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// export const backgroundRuntime = createWorkletRuntime('background');

export default function App(): React.JSX.Element {
  
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ 
        persister: clientPersister
    }}>
      <GestureHandlerRootView>
        <TamaguiProvider config={jellifyConfig}>
          <Theme name={isDarkMode ? 'dark' : 'light'}>
              <Jellify />
          </Theme>
        </TamaguiProvider>
      </GestureHandlerRootView>
    </PersistQueryClientProvider>
  );
}