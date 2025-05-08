import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import FavoritePlaylists from './component'
import React from 'react'

export default function PlaylistsScreen({
	navigation,
}: NativeStackScreenProps<StackParamList>): React.JSX.Element {
	return <FavoritePlaylists navigation={navigation} />
}
