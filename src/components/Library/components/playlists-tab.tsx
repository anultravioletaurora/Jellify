import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../../types'
import Playlists from '../../Playlists/component'
import React from 'react'

export default function PlaylistsScreen({
	navigation,
}: NativeStackScreenProps<StackParamList>): React.JSX.Element {
	return <Playlists navigation={navigation} />
}
