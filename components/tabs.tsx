import React from "react";
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./Home/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Library from "./Library/stack";
import Settings from "./Settings/stack";
import { Discover } from "./Discover/stack";
import { Miniplayer } from "./Player/mini-player";
import { getTokens, Separator } from "tamagui";
import { usePlayerContext } from "../player/provider";
import SearchStack from "./Search/stack";
import LibraryStack from "./Library/stack";

const Tab = createBottomTabNavigator();

export function Tabs() : React.JSX.Element {

    const { nowPlaying } = usePlayerContext();

    return (
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    animation: 'shift',
                    tabBarActiveTintColor: getTokens().color.telemagenta.val,
                    tabBarInactiveTintColor: getTokens().color.amethyst.val
                }}
                tabBar={(props) => (
                    <>
                        { nowPlaying && (
                            /* Hide miniplayer if the queue is empty */
                            <>
                                <Separator />
                                <Miniplayer navigation={props.navigation} />
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
                    name="Library"
                    component={LibraryStack}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color, size }) => (
                            <MaterialCommunityIcons name="book-music-outline" color={color} size={size} />
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