import React from 'react'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Library from './Library/stack'
import Settings from './Settings/stack'
import { Discover } from './Discover/stack'
import { Miniplayer } from './Player/mini-player'
import { getToken, getTokens, Separator } from 'tamagui'
import { usePlayerContext } from '../player/provider'
import SearchStack from './Search/stack'
import LibraryStack from './Library/stack'
import { useColorScheme, View } from 'react-native'
import InternetConnectionWatcher from './Network/internetConnectionWatcher'

const Tab = createBottomTabNavigator()

export function Tabs(): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark'
	const { nowPlaying } = usePlayerContext()

	return (
		<View style={{ flex: 1 }}>
			<Tab.Navigator
				initialRouteName='Home'
				screenOptions={{
					lazy: false,
					animation: 'shift',
					tabBarActiveTintColor: getTokens().color.telemagenta.val,
					tabBarInactiveTintColor: isDarkMode
						? getToken('$color.amethyst')
						: getToken('$color.purpleGray'),
				}}
				tabBar={(props) => (
					<>
						{nowPlaying && (
							/* Hide miniplayer if the queue is empty */
							<>
								<Separator />
								<Miniplayer navigation={props.navigation} />
							</>
						)}
						<InternetConnectionWatcher />

						<BottomTabBar {...props} />
					</>
				)}
			>
				<Tab.Screen
					name='Home'
					component={Home}
					options={{
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name='jellyfish-outline'
								color={color}
								size={size}
							/>
						),
					}}
				/>

				<Tab.Screen
					name='Library'
					component={LibraryStack}
					options={{
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name='book-music-outline'
								color={color}
								size={size}
							/>
						),
					}}
				/>

				<Tab.Screen
					name='Search'
					component={SearchStack}
					options={{
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name='magnify' color={color} size={size} />
						),
					}}
				/>

				<Tab.Screen
					name='Discover'
					component={Discover}
					options={{
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons
								name='music-box-multiple-outline'
								color={color}
								size={size}
							/>
						),
					}}
				/>

				<Tab.Screen
					name='Settings'
					component={Settings}
					options={{
						headerShown: false,
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name='dip-switch' color={color} size={size} />
						),
					}}
				/>
			</Tab.Navigator>
		</View>
	)
}
