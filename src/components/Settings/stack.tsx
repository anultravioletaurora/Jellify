import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Root from './component'
import AccountDetails from './screens/account-details'
import Labs from './screens/labs'
import DetailsScreen from '../ItemDetail/screen'
import { StackParamList } from '../types'
import PlaybackDetails from './screens/playback-details'
import ServerDetails from './screens/server-details'
import DownloadsDetails from './screens/downloads-details'

export const SettingsStack = createNativeStackNavigator<StackParamList>()

export default function Settings(): React.JSX.Element {
	return (
		<SettingsStack.Navigator>
			<SettingsStack.Screen
				name='Settings'
				component={Root}
				options={{
					headerLargeTitle: true,
					headerLargeTitleStyle: {
						fontFamily: 'Aileron-Bold',
					},
				}}
			/>

			<SettingsStack.Screen
				name='Account'
				component={AccountDetails}
				options={{
					title: 'Account',
					headerLargeTitle: true,
					headerLargeTitleStyle: {
						fontFamily: 'Aileron-Bold',
					},
				}}
			/>

			<SettingsStack.Screen name='Server' component={ServerDetails} />

			<SettingsStack.Screen name='Playback' component={PlaybackDetails} />

			<SettingsStack.Screen
				name='Labs'
				component={Labs}
				options={{
					headerLargeTitle: true,
					headerLargeTitleStyle: {
						fontFamily: 'Aileron-Bold',
					},
				}}
			/>

			<SettingsStack.Screen name='Downloads' component={DownloadsDetails} />

			<SettingsStack.Group screenOptions={{ presentation: 'modal' }}>
				<SettingsStack.Screen
					name='Details'
					component={DetailsScreen}
					options={{
						headerShown: false,
					}}
				/>
			</SettingsStack.Group>
		</SettingsStack.Navigator>
	)
}
