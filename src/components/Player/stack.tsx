import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import PlayerScreen from './screens'
import Queue from './screens/queue'
import DetailsScreen from '../ItemDetail/screen'

export const PlayerStack = createNativeStackNavigator<StackParamList>()

export default function Player(): React.JSX.Element {
	return (
		<PlayerStack.Navigator initialRouteName='Player'>
			<PlayerStack.Screen
				name='Player'
				component={PlayerScreen}
				options={{
					headerShown: false,
					headerTitle: '',
				}}
			/>

			<PlayerStack.Screen
				name='Queue'
				component={Queue}
				options={{
					headerTitle: '',
				}}
			/>

			<PlayerStack.Screen
				name='Details'
				component={DetailsScreen}
				options={{
					headerTitle: '',
				}}
			/>
		</PlayerStack.Navigator>
	)
}
