import { Text } from '../../components/Global/helpers/text'
import React from 'react'
import { View } from 'tamagui'
import { useJellifyContext } from '../../providers'
export default function LibraryDetails(): React.JSX.Element {
	const { library } = useJellifyContext()

	return (
		<View>
			<Text>{`LibraryID: ${library!.musicLibraryId}`}</Text>
			<Text>{`Playlist LibraryID: ${library!.playlistLibraryId}`}</Text>
		</View>
	)
}
