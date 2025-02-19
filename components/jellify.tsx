import _ from "lodash";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./navigation";
import Login from "./Login/component";
import { JellyfinAuthenticationProvider } from "./Login/provider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { JellifyDarkTheme, JellifyLightTheme } from "./theme";
import { PlayerProvider } from "../player/provider";
import { useColorScheme } from "react-native";
import { PortalProvider } from "@tamagui/portal";
import { JellifyProvider, useJellifyContext } from "./provider";
import { ToastProvider } from "@tamagui/toast";
import SafeToastViewport from "./Global/components/toast-area-view-port";

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
    <NavigationContainer theme={isDarkMode ? JellifyDarkTheme : JellifyLightTheme}>
      <SafeAreaProvider>
        { loggedIn ? (
          <PlayerProvider>
            <Navigation />
          </PlayerProvider>
         ) : (
           <JellyfinAuthenticationProvider>
            <Login /> 
          </JellyfinAuthenticationProvider>
        )}
        <SafeToastViewport />
      </SafeAreaProvider>
    </NavigationContainer>
  )
}