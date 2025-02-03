import React from "react";
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./Home/component";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useColorScheme } from "react-native";
import Favorites from "./Favorites/component";
import Settings from "./Settings/stack";
import { Discover } from "./Discover/component";
import { Miniplayer } from "./Player/mini-player";
import { getTokens, Separator } from "tamagui";
import { usePlayerContext } from "../player/provider";
import SearchStack from "./Search/stack";

const Tab = createBottomTabNavigator();

export function Tabs() : React.JSX.Element {

    const isDarkMode = useColorScheme() === 'dark';

    const { showMiniplayer } = usePlayerContext();

    return (
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: getTokens().color.telemagenta.val,
                    tabBarInactiveTintColor: getTokens().color.amethyst.val
                }}
                tabBar={(props) => (
                    <>
                        { showMiniplayer && (
                            /* Hide miniplayer if the queue is empty */
                            <>
                                <Separator />
                                <Miniplayer navigation={props.navigation} />
                                <Separator />
                            </>
                        )}
                        <BottomTabBar {...props} />
                    </>
                )}
            >
                <Tab.Screen 
                    name="Home" 
                    component={Home}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="jellyfish-outline" color={color} size={size} />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Favorites"
                    component={Favorites}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color, size }) => (
                            <MaterialCommunityIcons name="heart-multiple-outline" color={color} size={size} />
                        )
                    }}
                />

                <Tab.Screen
                    name="Search"
                    component={SearchStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={size} />
                        )
                    }}
                />

                <Tab.Screen
                    name="Discover"
                    component={Discover}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="music-box-multiple-outline" color={color} size={size} />
                        )
                    }}
                />

                <Tab.Screen
                    name="Settings"
                    component={Settings}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="dip-switch" color={color} size={size} />
                        )
                    }}
                />
            </Tab.Navigator>
    )
}