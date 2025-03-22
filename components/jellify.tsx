import _ from "lodash";
import React from "react";
import Navigation from "./navigation";
import Login from "./Login/component";
import { JellyfinAuthenticationProvider } from "./Login/provider";
import { PlayerProvider } from "../player/provider";
import { useColorScheme } from "react-native";
import { PortalProvider } from "@tamagui/portal";
import { JellifyProvider, useJellifyContext } from "./provider";
import { ToastProvider } from "@tamagui/toast";

export default function Jellify(): React.JSX.Element {

  return (
    <PortalProvider shouldAddRootHost>
      <ToastProvider burntOptions={{ from: 'top'}}>
        <JellifyProvider>
          <App />
        </JellifyProvider>
      </ToastProvider>
    </PortalProvider>
  );
}

function App(): React.JSX.Element {

  const isDarkMode = useColorScheme() === "dark";
  const { loggedIn } = useJellifyContext();
  
  return (
        loggedIn ? (
          <PlayerProvider>
            <Navigation />
          </PlayerProvider>
         ) : (
           <JellyfinAuthenticationProvider>
            <Login /> 
          </JellyfinAuthenticationProvider>
        )
  )
}