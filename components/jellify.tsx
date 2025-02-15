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
import { ToastProvider, ToastViewport } from "@tamagui/toast";
import SafeToastViewport from "./Global/components/toast-area-view-port";
import { QueryKeys } from "../enums/query-keys";
import { useQuery } from "@tanstack/react-query";
import TrackPlayer, { IOSCategory, IOSCategoryOptions } from "react-native-track-player";
import { CAPABILITIES } from "../player/constants";

export default function Jellify(): React.JSX.Element {

  const { isSuccess: isPlayerReady } = useQuery({
    queryKey: [QueryKeys.Player],
    queryFn: async () => {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
        maxCacheSize: 1000 * 100, // 100MB, TODO make this adjustable
        iosCategory: IOSCategory.Playback,
        iosCategoryOptions: [
            IOSCategoryOptions.AllowAirPlay,
            IOSCategoryOptions.AllowBluetooth,
        ]
      });
      
      return await TrackPlayer.updateOptions({
        progressUpdateEventInterval: 1,
        capabilities: CAPABILITIES,
        notificationCapabilities: CAPABILITIES,
        compactCapabilities: CAPABILITIES,
        // ratingType: RatingType.Heart,
        // likeOptions: {
        //     isActive: false,
        //     title: "Favorite"
        // },
        // dislikeOptions: {
        //     isActive: true,
        //     title: "Unfavorite"
        // }
      });
    },
    retry: 0,
    // staleTime: 1000 * 60 * 60 * 24 * 7 // 7 days
  });

  return (
    <PortalProvider shouldAddRootHost>
      <ToastProvider burntOptions={{ from: 'top'}}>
        <JellifyProvider>
          { isPlayerReady && (
            <App />
          )}
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