import { H3, ScrollView, Separator, XStack, YStack } from "tamagui";
import _ from "lodash";
import RecentlyPlayed from "./helpers/recently-played";
import { useApiClientContext } from "../jellyfin-api-provider";
import RecentArtists from "./helpers/recent-artists";
import { RefreshControl } from "react-native";
import { HomeProvider, useHomeContext } from "./provider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackParamList, ProvidedHomeProps } from "../types";
import { HomeArtistScreen } from "./screens/artist";
import Avatar from "../Global/helpers/avatar";
import { HomeAlbumScreen } from "./screens/album";
import Playlists from "./helpers/playlists";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomePlaylistScreen } from "./screens/playlist";

const HomeStack = createNativeStackNavigator<StackParamList>();

export default function Home(): React.JSX.Element {

    const { user } = useApiClientContext();

    return (
        <HomeProvider>
            <HomeStack.Navigator 
                id="Home" 
                initialRouteName="Home"
                screenOptions={{
                }}
            >
                <HomeStack.Screen 
                    name="Home" 
                    component={ProvidedHome} 
                    options={{
                        headerLargeTitle: true,
                        headerLargeTitleStyle: {
                            fontFamily: 'Aileron-Bold'
                        }
                    }}
                />

                <HomeStack.Screen 
                    name="Artist" 
                    component={HomeArtistScreen} 
                    options={({ route }) => ({
                        title: route.params.artistName,
                        headerLargeTitle: true,
                        headerLargeTitleStyle: {
                            fontFamily: 'Aileron-Bold'
                        }
                    })}
                />

                <HomeStack.Screen
                    name="Album"
                    component={HomeAlbumScreen}
                    options={({ route }) => ({
                        headerShown: true,
                        headerTitle: ""
                    })}
                />

                <HomeStack.Screen
                    name="Playlist"
                    component={HomePlaylistScreen}
                    options={({ route }) => ({
                        headerShown: true,
                        headerTitle: ""
                    })}
                />
            </HomeStack.Navigator>
        </HomeProvider>
    );
}

function ProvidedHome({ route, navigation }: ProvidedHomeProps): React.JSX.Element {

    const { user } = useApiClientContext();

    const { refreshing: refetching, onRefresh: onRefetch } = useHomeContext()

    return (
        <SafeAreaView edges={["top", "right", "left"]}>
            <ScrollView 
                contentInsetAdjustmentBehavior="automatic"
                refreshControl={
                    <RefreshControl 
                    refreshing={refetching} 
                    onRefresh={onRefetch}
                    />
                }>
                <YStack alignContent='flex-start'>
                    <XStack margin={"$2"}>
                        <H3>{`Hi, ${user!.name}`}</H3>
                        <YStack />
                        <Avatar maxHeight={30} itemId={user!.id} />
                    </XStack>

                    <Separator marginVertical={"$2"} />

                    <RecentArtists route={route} navigation={navigation} />

                    <Separator marginVertical={"$3"} />

                    <RecentlyPlayed />

                    <Separator marginVertical={"$3"} />

                    <Playlists route={route} navigation={navigation}/>
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}