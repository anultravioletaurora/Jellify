import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Root from '../../components/Settings/component'
import AccountDetails from './account-details'
import Labs from './labs'
import DetailsScreen from '../Detail'
import { StackParamList } from '../../components/types'
import PlaybackDetails from './playback-details'
import ServerDetails from './server-details'

export const SettingsStack = createNativeStackNavigator<StackParamList>()

export default function SettingsScreen(): React.JSX.Element {
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
