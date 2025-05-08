import { View, XStack } from 'tamagui'
import { DeletePlaylistProps } from '../../../components/types'
import Button from '../../../components/Global/helpers/button'
import { Text } from '../../../components/Global/helpers/text'
import { useMutation } from '@tanstack/react-query'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { deletePlaylist } from '../../../api/mutations/playlists'
import { trigger } from 'react-native-haptic-feedback'
import { queryClient } from '../../../constants/query-client'
import { QueryKeys } from '../../../enums/query-keys'
import { useJellifyContext } from '../../../providers'
// import * as Burnt from 'burnt'

export default function DeletePlaylist({
	navigation,
	route,
}: DeletePlaylistProps): React.JSX.Element {
	const { api, user, library } = useJellifyContext()
	const useDeletePlaylist = useMutation({
		mutationFn: (playlist: BaseItemDto) => deletePlaylist(api, playlist.Id!),
		onSuccess: (data, playlist) => {
			trigger('notificationSuccess')

			navigation.goBack()
			navigation.goBack()
			// Burnt.alert({
			// 	title: `Playlist deleted`,
			// 	message: `Deleted ${playlist.Name ?? 'Untitled Playlist'}`,
			// 	duration: 1,
			// 	preset: 'done',
			// })

			// Refresh favorite playlists component in library
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.FavoritePlaylists],
			})

			// Refresh home screen user playlists
			queryClient.invalidateQueries({
				queryKey: [QueryKeys.UserPlaylists],
			})
		},
		onError: () => {
			trigger('notificationError')
		},
	})

	return (
		<View marginHorizontal={'$2'}>
			<Text bold textAlign='center'>{`Delete playlist ${
				route.params.playlist.Name ?? 'Untitled Playlist'
			}?`}</Text>
			<XStack justifyContent='space-evenly'>
				<Button onPress={() => navigation.goBack()}>Cancel</Button>
				<Button danger onPress={() => useDeletePlaylist.mutate(route.params.playlist)}>
					Delete
				</Button>
			</XStack>
		</View>
	)
}
