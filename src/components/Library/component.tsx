import { StackParamList } from '../../components/types'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import PlaylistsScreen from './components/playlists-tab'
import { getToken } from 'tamagui'
import { useColorScheme } from 'react-native'
import Icon from '../Global/helpers/icon'
import TracksTab from './components/tracks-tab'
import ArtistsTab from './components/artists-tab'
import AlbumsTab from './components/albums-tab'
import LibraryTabBar from './tab-bar'
import { Gesture } from 'react-native-gesture-handler'
import { GestureDetector } from 'react-native-gesture-handler'

const panGesture = Gesture.Pan()

const LibraryTabsNavigator = createMaterialTopTabNavigator()

export default function Library({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList, 'Library'>
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark'

	return (
		<GestureDetector gesture={panGesture}>
			<LibraryTabsNavigator.Navigator
				tabBar={(props) => <LibraryTabBar {...props} />}
				screenOptions={{
					lazy: true,
					tabBarShowIcon: true,
					tabBarActiveTintColor: getToken('$color.telemagenta'),
					tabBarInactiveTintColor: isDarkMode
						? getToken('$color.amethyst')
						: getToken('$color.purpleGray'),
					tabBarLabelStyle: {
						fontFamily: 'Aileron-Bold',
					},
				}}
			>
				<LibraryTabsNavigator.Screen
					name='Artists'
					component={ArtistsTab}
					options={{
						tabBarIcon: ({ focused, color }) => (
							<Icon name='microphone-variant' color={color} small />
						),
					}}
				/>

				<LibraryTabsNavigator.Screen
					name='Albums'
					component={AlbumsTab}
					options={{
						tabBarIcon: ({ focused, color }) => (
							<Icon name='music-box-multiple' color={color} small />
						),
					}}
					initialParams={{ navigation }}
				/>

				<LibraryTabsNavigator.Screen
					name='Tracks'
					component={TracksTab}
					options={{
						tabBarIcon: ({ focused, color }) => (
							<Icon name='music-clef-treble' color={color} small />
						),
					}}
				/>

				<LibraryTabsNavigator.Screen
					name='Playlists'
					component={PlaylistsScreen}
					options={{
						tabBarIcon: ({ focused, color }) => (
							<Icon name='playlist-music' color={color} small />
						),
					}}
					initialParams={{ navigation }}
				/>
			</LibraryTabsNavigator.Navigator>
		</GestureDetector>
	)
}
