import React, { useEffect, useState } from 'react'
import { getToken, Spinner, ToggleGroup } from 'tamagui'
import { useAuthenticationContext } from '../provider'
import { H1, H2, Label, Text } from '../../Global/helpers/text'
import Button from '../../Global/helpers/button'
import _ from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'
import Client from '../../../api/client'
import { useJellifyContext } from '../../provider'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { QueryKeys } from '../../../enums/query-keys'
import { fetchUserViews } from '../../../api/queries/libraries'
import { useQuery } from '@tanstack/react-query'

export default function ServerLibrary(): React.JSX.Element {
	const { setUser } = useAuthenticationContext()

	const { setLoggedIn } = useJellifyContext()

	const [libraryId, setLibraryId] = useState<string | undefined>(undefined)
	const [playlistLibrary, setPlaylistLibrary] = useState<BaseItemDto | undefined>(undefined)

	const {
		data: libraries,
		isError,
		isPending,
		isSuccess,
		refetch,
	} = useQuery({
		queryKey: [QueryKeys.UserViews],
		queryFn: () => fetchUserViews(),
	})

	useEffect(() => {
		if (!isPending && isSuccess)
			setPlaylistLibrary(
				libraries?.filter((library) => library.CollectionType === 'playlists')[0],
			)
	}, [isPending, isSuccess])

	return (
		<SafeAreaView>
			<H2>Select Music Library</H2>

			{isPending ? (
				<Spinner size='large' />
			) : (
				<ToggleGroup
					orientation='vertical'
					type='single'
					disableDeactivation={true}
					value={libraryId}
					onValueChange={setLibraryId}
				>
					{libraries!
						.filter((library) => library.CollectionType === 'music')
						.map((library) => {
							return (
								<ToggleGroup.Item
									key={library.Id}
									value={library.Id!}
									aria-label={library.Name!}
									backgroundColor={
										libraryId == library.Id!
											? getToken('$color.purpleGray')
											: 'unset'
									}
								>
									<Text>{library.Name ?? 'Unnamed Library'}</Text>
								</ToggleGroup.Item>
							)
						})}
				</ToggleGroup>
			)}

			{isError && <Text>Unable to load libraries</Text>}

			<Button
				disabled={!libraryId}
				onPress={() => {
					Client.setLibrary({
						musicLibraryId: libraryId!,
						musicLibraryName:
							libraries?.filter((library) => library.Id == libraryId)[0].Name ??
							'No library name',
						musicLibraryPrimaryImageId: libraries?.filter(
							(library) => library.Id == libraryId,
						)[0].ImageTags!.Primary,
						playlistLibraryId: playlistLibrary?.Id,
						playlistLibraryPrimaryImageId: playlistLibrary?.ImageTags!.Primary,
					})
					setLoggedIn(true)
				}}
			>
				{`Let's Go!`}
			</Button>

			<Button
				onPress={() => {
					Client.switchUser()
					setUser(undefined)
				}}
			>
				Switch User
			</Button>
		</SafeAreaView>
	)
}
