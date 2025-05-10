import React from 'react'
import { useColorScheme } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { getToken } from 'tamagui'
import AccountTab from './components/account-tab'
import Icon from '../Global/helpers/icon'
import LabsTab from './components/labs-tab'
import PreferencesTab from './components/preferences-tab'
import InfoTab from './components/info-tab'

const SettingsTabsNavigator = createMaterialTopTabNavigator()

export default function Settings(): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark'

	return (
		<SettingsTabsNavigator.Navigator
			screenOptions={{
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
			<SettingsTabsNavigator.Screen
				name='Settings'
				component={PreferencesTab}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<Icon name='headphones-settings' color={color} small />
					),
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='Account'
				component={AccountTab}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<Icon name='account-music' color={color} small />
					),
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='Labs'
				component={LabsTab}
				options={{
					tabBarIcon: ({ focused, color }) => <Icon name='flask' color={color} small />,
				}}
			/>

			<SettingsTabsNavigator.Screen
				name='About'
				component={InfoTab}
				options={{
					tabBarIcon: ({ focused, color }) => (
						<Icon name='information' color={color} small />
					),
				}}
			/>
		</SettingsTabsNavigator.Navigator>
	)
}
