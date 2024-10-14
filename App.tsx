import './gesture-handler';
import "./global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React from 'react';

import Jellify from './components/jellify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function App(): React.JSX.Element {

  const queryClient = new QueryClient();

  return (
    <GluestackUIProvider mode="light"><QueryClientProvider client={queryClient}>
        <Jellify />
      </QueryClientProvider></GluestackUIProvider>
  );
}