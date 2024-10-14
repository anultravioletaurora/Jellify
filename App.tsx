import './gesture-handler';
import React from 'react';

import Jellify from './components/jellify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import "./global.css"

export default function App(): React.JSX.Element {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Jellify />
    </QueryClientProvider>
  );
}