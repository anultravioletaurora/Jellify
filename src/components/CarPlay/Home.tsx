import { QueryKeys } from '../../enums/query-keys'
import { CarPlay, ListTemplate } from 'react-native-carplay'
import { queryClient } from '../../constants/query-client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import TracksTemplate from './Tracks'
import ArtistsTemplate from './Artists'
import uuid from 'react-native-uuid'
import { Api } from '@jellyfin/sdk'
import { JellifyUser } from '../../types/JellifyUser'

const CarPlayHome = (api: Api, user: JellifyUser, sessionId: string) =>
	new ListTemplate({
		id: uuid.v4(),
		title: 'Home',
		tabTitle: 'Home',
		tabSystemImageName: 'music.house.fill',
		sections: [
			{
				header: `Hi ${user.name}`,
				items: [],
			},
			{
				header: 'Recents',
				items: [
					{ id: QueryKeys.RecentlyPlayedArtists, text: 'Recent Artists' },
					{ id: QueryKeys.RecentlyPlayed, text: 'Play it again' },
				],
			},
			{
				header: 'Frequents',
				items: [
					{ id: QueryKeys.FrequentArtists, text: 'Most Played' },
					{ id: QueryKeys.FrequentlyPlayed, text: 'On Repeat' },
				],
			},
		],
		onItemSelect: async ({ index }) => {
			console.debug(`Home item selected`)

			switch (index) {
				case 0: {
					// Recent Artists
					const artists =
						queryClient.getQueryData<BaseItemDto[]>([
							QueryKeys.RecentlyPlayedArtists,
						]) ?? []
					CarPlay.pushTemplate(ArtistsTemplate(artists))
					break
				}

				case 1: {
					// Recent Tracks
					const items =
						queryClient.getQueryData<BaseItemDto[]>([QueryKeys.RecentlyPlayed]) ?? []
					CarPlay.pushTemplate(TracksTemplate(api, sessionId, items, 'Recently Played'))
					break
				}

				case 2: {
					// Most Played Artists
					const artists =
						queryClient.getQueryData<BaseItemDto[]>([QueryKeys.FrequentArtists]) ?? []
					CarPlay.pushTemplate(ArtistsTemplate(artists))
					break
				}

				case 3: {
					// On Repeat
					const items =
						queryClient.getQueryData<BaseItemDto[]>([QueryKeys.FrequentlyPlayed]) ?? []
					CarPlay.pushTemplate(TracksTemplate(api, sessionId, items, 'On Repeat'))
					break
				}
			}
		},
	})

export default CarPlayHome
