import Client from "../api/client";
import { isUndefined } from "lodash";
import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { Platform } from 'react-native'

// 'react-native-carplay' has also been disabled for android builds in react-native.config.js 
const CarPlayModule = Platform.OS === 'ios' ? require('react-native-carplay') : null;
const CarPlayNavigation = CarPlayModule ? require('./CarPlay/Navigation').CarPlayNavigation : null;
const CarPlayNowPlaying = CarPlayModule ? require('./CarPlay/NowPlaying').CarPlayNowPlaying : null;

interface JellifyContext {
    loggedIn: boolean;
    setLoggedIn: React.Dispatch<SetStateAction<boolean>>;
    carPlayConnected: boolean;
}

const JellifyContextInitializer = () => {

    console.debug(CarPlayModule)
    console.debug(typeof(CarPlayModule))

    const [loggedIn, setLoggedIn] = useState<boolean>(
        !isUndefined(Client) &&
        !isUndefined(Client.api) && 
        !isUndefined(Client.user) &&
        !isUndefined(Client.server) &&
        !isUndefined(Client.library)
    );


    const [carPlayConnected, setCarPlayConnected] = useState(CarPlayModule ? CarPlayModule.connected : false);

    useEffect(() => {
  
      function onConnect() {
        setCarPlayConnected(true);

        if (loggedIn && CarPlayModule) {
            CarPlayModule.CarPlay.setRootTemplate(CarPlayNavigation, true);
            CarPlayModule.CarPlay.pushTemplate(CarPlayNowPlaying, true);
            CarPlayModule.CarPlay.enableNowPlaying(true); // https://github.com/birkir/react-native-carplay/issues/185
        }
      }
  
      function onDisconnect() {
        setCarPlayConnected(false);
      }

      if (CarPlayModule) {
          CarPlayModule.CarPlay.registerOnConnect(onConnect);
          CarPlayModule.CarPlay.registerOnDisconnect(onDisconnect);
          return () => {
            CarPlayModule.CarPlay.unregisterOnConnect(onConnect)
            CarPlayModule.CarPlay.unregisterOnDisconnect(onDisconnect)
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