import './gesture-handler';
import "./global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React from 'react';
import "react-native-url-polyfill/auto";

import Jellify from './components/jellify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App(): React.JSX.Element {

  const queryClient = new QueryClient();


  return (
    <GluestackUIProvider mode="light"><QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{flex: 1}}>
            <Jellify />
        </GestureHandlerRootView>
      </QueryClientProvider></GluestackUIProvider>
  );
}