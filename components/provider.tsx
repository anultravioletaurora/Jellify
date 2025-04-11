import Client from "../api/client";
import { isNull, isUndefined } from "lodash";
import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { Platform } from 'react-native'
import { CarPlayInterface, NowPlayingTemplate, TabBarTemplate } from "react-native-carplay";

// 'react-native-carplay' has also been disabled for android builds in react-native.config.js 
const CarPlay = Platform.OS === 'ios' ? require('react-native-carplay').CarPlay as CarPlayInterface : null;
const CarPlayNavigation = CarPlay ? require('./CarPlay/Navigation') : null;
const CarPlayNowPlaying = CarPlay ? require('./CarPlay/NowPlaying') : null

interface JellifyContext {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
    carPlayConnected: boolean;
}

const JellifyContextInitializer = () => {

    const [loggedIn, setLoggedIn] = useState<boolean>(
        !isUndefined(Client) &&
        !isUndefined(Client.api) && 
        !isUndefined(Client.user) &&
        !isUndefined(Client.server) &&
        !isUndefined(Client.library)
    );


    const [carPlayConnected, setCarPlayConnected] = useState(CarPlay ? CarPlay.connected : false);

    useEffect(() => {
  
      function onConnect() {
        setCarPlayConnected(true);

        if (loggedIn && CarPlay) {

            console.debug(CarPlayNavigation);
            console.debug(CarPlayNowPlaying);

            CarPlay.setRootTemplate(CarPlayNavigation, true);
            CarPlay.pushTemplate(CarPlayNowPlaying, true);
            CarPlay.enableNowPlaying(true); // https://github.com/birkir/react-native-carplay/issues/185
        }
      }
  
      function onDisconnect() {
        setCarPlayConnected(false);
      }

      if (CarPlay) {
          CarPlay.registerOnConnect(onConnect);
          CarPlay.registerOnDisconnect(onDisconnect);
          return () => {
            CarPlay.unregisterOnConnect(onConnect)
            CarPlay.unregisterOnDisconnect(onDisconnect)
          };
      }
    });

    return {
        loggedIn,
        setLoggedIn,
        carPlayConnected
    }
}

const JellifyContext = createContext<JellifyContext>({
    loggedIn: false,
    setLoggedIn: () => {},
    carPlayConnected: false
});

export const JellifyProvider: ({ children }: {
    children: ReactNode
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
    const {
        loggedIn,
        setLoggedIn,
        carPlayConnected
    } = JellifyContextInitializer();

    return (
        <JellifyContext.Provider
            value={{
                loggedIn,
                setLoggedIn,
                carPlayConnected
            }}
            >
                {children}
            </JellifyContext.Provider>
    )
}

export const useJellifyContext = () => useContext(JellifyContext);