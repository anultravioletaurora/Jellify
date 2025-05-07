import { StackParamList } from '../types'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import Playlist from './index'
import { PlaylistProvider } from './provider'

export function PlaylistScreen({
	route,
	navigation,
}: {
	route: RouteProp<StackParamList, 'Playlist'>
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return (
		<PlaylistProvider playlist={route.params.playlist}>
			<Playlist playlist={route.params.playlist} navigation={navigation} />
		</PlaylistProvider>
	)
}
