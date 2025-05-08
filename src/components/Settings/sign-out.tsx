import React from 'react'
import Button from '../Global/helpers/button'
import TrackPlayer from 'react-native-track-player'
import { StackParamList } from '../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

export default function SignOut(): React.JSX.Element {
	const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>()

	return (
		<Button
			onPress={() => {
				TrackPlayer.reset()
					.then(() => {
						console.debug('TrackPlayer cleared')
					})
					.catch((error) => {
						console.error('Error clearing TrackPlayer', error)
					})
					.finally(() => {
						navigation.reset({
							index: 0,
							routes: [
								{
									name: 'Login',
									params: {
										screen: 'ServerAddress',
									},
								},
							],
						})
					})
			}}
		>
			Sign Out
		</Button>
	)
}
