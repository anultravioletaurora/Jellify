import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { getToken, useTheme } from 'tamagui'
import AccountTab from './components/account-tab'
import Icon from '../Global/components/icon'
import LabsTab from './components/labs-tab'
import PreferencesTab from './components/preferences-tab'
import PlaybackTab from './components/playback-tab'
import InfoTab from './components/info-tab'

const SettingsTabsNavigator = createMaterialTopTabNavigator()

export default function Settings(): React.JSX.Element {
	const theme = useTheme()

	return (
		<SettingsTabsNavigator.Navigator
			screenOptions={{
				tabBarScrollEnabled: true,
				tabBarItemStyle: {
					width: getToken('$13'),
				},
				tabBarShowIcon: true,
				tabBarActiveTintColor: theme.primary.val,
				tabBarInactiveTintColor: theme.borderColor.val,
				tabBarLabelStyle: {
					fontFamily: 'Aileron-Bold',
				},
			}}
		>
			<SettingsTabsNavigator.Screen
				name='Settings'
				component={PreferencesTab}
				options={{
					title: 'App',
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name='jellyfish-outline'
							color={focused ? '$primary' : '$borderColor'}
							small
						/>
					),
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='Playback'
				component={PlaybackTab}
				options={{
					title: 'Player',
					tabBarIcon: ({ focused, color }) => (
						<Icon name='cassette' color={focused ? '$primary' : '$borderColor'} small />
					),
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='Account'
				component={AccountTab}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name='account-music'
							color={focused ? '$primary' : '$borderColor'}
							small
						/>
					),
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='Labs'
				component={LabsTab}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<Icon name='flask' color={focused ? '$primary' : '$borderColor'} small />
					),
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='About'
				component={InfoTab}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<Icon
							name='information'
							color={focused ? '$primary' : '$borderColor'}
							small
						/>
					),
				}}
			/>
		</SettingsTabsNavigator.Navigator>
	)
}
