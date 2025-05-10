import React from 'react'
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../screens/Home'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SettingsScreen from '../screens/Settings'
import { Discover } from '../screens/Discover'
import { Miniplayer } from './Player/mini-player'
import { getToken, getTokens, Separator, useTheme } from 'tamagui'
import { usePlayerContext } from '../providers/Player'
import SearchStack from '../screens/Search'
import LibraryStack from '../screens/Library'
import { useColorScheme } from 'react-native'
import InternetConnectionWatcher from './Network/internetConnectionWatcher'

const Tab = createBottomTabNavigator()

export function Tabs(): React.JSX.Element {
	const theme = useTheme()
	const { nowPlaying } = usePlayerContext()

	return (
		<Tab.Navigator
			initialRouteName='Home'
			screenOptions={{
				animation: 'shift',
				tabBarActiveTintColor: theme.primary.val,
				tabBarInactiveTintColor: theme.borderColor.val,
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
							name='music-box-multiple'
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
						<MaterialCommunityIcons name='earth' color={color} size={size} />
					),
				}}
			/>

			<Tab.Screen
				name='Settings'
				component={SettingsScreen}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name='dip-switch' color={color} size={size} />
					),
				}}
			/>
		</Tab.Navigator>
	)
}
