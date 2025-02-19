import Client from "../api/client";
import { isUndefined } from "lodash";
import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { CarPlay } from "react-native-carplay";
import CarPlayNavigation from "./CarPlay/Navigation";
import CarPlayNowPlaying from "./CarPlay/NowPlaying";

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


    const [carPlayConnected, setCarPlayConnected] = useState(CarPlay.connected);

    useEffect(() => {
  
      function onConnect() {
        setCarPlayConnected(true);

        if (loggedIn) {
            CarPlay.setRootTemplate(CarPlayNavigation, true);
            CarPlay.pushTemplate(CarPlayNowPlaying, true);
            CarPlay.enableNowPlaying(true); // https://github.com/birkir/react-native-carplay/issues/185
        }
      }
  
      function onDisconnect() {
        setCarPlayConnected(false);
      }

      CarPlay.registerOnConnect(onConnect);
      CarPlay.registerOnDisconnect(onDisconnect);
      return () => {
        CarPlay.unregisterOnConnect(onConnect)
        CarPlay.unregisterOnDisconnect(onDisconnect)
      };
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