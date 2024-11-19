import { Api } from '@jellyfin/sdk';
import React, { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { MMKV } from 'react-native-mmkv';
import { MMKVStorageKeys } from '../enums/mmkv-storage-keys';
import { buildApiClient } from '../api/client';
import { useApi } from '../api/queries';

interface JellyfinApiClientContext {
  storage: MMKV;
  serverUrl: string | undefined,
  setServerUrl: React.Dispatch<SetStateAction<string | undefined>>,
  username: string | undefined,
  setUsername: React.Dispatch<SetStateAction<string | undefined>>,
  accessToken: string | undefined,
  setAccessToken: React.Dispatch<SetStateAction<string | undefined>>,
  apiClient: Api | undefined;
}

const JellyfinApiClientContextInitializer = () => {

    const storage = new MMKV();
    
    const [serverUrl, setServerUrl] = useState<string | undefined>(storage.getString(MMKVStorageKeys.ServerUrl));
    const [username, setUsername] = useState<string | undefined>(storage.getString(MMKVStorageKeys.Username));
    const [accessToken, setAccessToken] = useState<string | undefined>(storage.getString(MMKVStorageKeys.AccessToken));

    let { data : apiClient, isFetching, refetch : createNewApiClient } = useApi(serverUrl, username, undefined, accessToken);

    useEffect(() => {
      createNewApiClient();
    }, [
      serverUrl,
      accessToken,
    ])

    return { 
      storage,
      serverUrl,
      setServerUrl,
      username,
      setUsername,
      accessToken,
      setAccessToken,
      apiClient, 
    };
}

export const JellyfinApiClientContext =
  createContext<JellyfinApiClientContext>({ 
    storage: new MMKV(),
    serverUrl: undefined,
    setServerUrl: () => {},
    username: undefined,
    setUsername: () => {},
    accessToken: undefined,
    setAccessToken: () => {},
    apiClient: undefined
  });

export const JellyfinApiClientProvider: ({ children }: {
  children: ReactNode;
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
  const { 
    storage,
    serverUrl,
    setServerUrl,
    username,
    setUsername,
    accessToken,
    setAccessToken,
    apiClient, 
   } = JellyfinApiClientContextInitializer();
  // Add your logic to check if credentials are stored and initialize the API client here.

  return (
    <JellyfinApiClientContext.Provider value={{ 
      storage,
      serverUrl, 
      setServerUrl,
      username,
      setUsername,
      accessToken,
      setAccessToken,
      apiClient, 
    }}>
        {children}
    </JellyfinApiClientContext.Provider>
  );
};

export const useApiClientContext = () => useContext(JellyfinApiClientContext)