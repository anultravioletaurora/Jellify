import Client from '../client'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'

export function fetchFrequentlyPlayed(): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		getItemsApi(Client.api!)
			.getItems({
				includeItemTypes: [BaseItemKind.Audio],
				parentId: Client.library!.musicLibraryId,
				recursive: true,
				limit: 100,
				sortBy: [ItemSortBy.PlayCount],
				sortOrder: [SortOrder.Descending],
			})
			.then(({ data }) => {
				if (data.Items) resolve(data.Items)
				else resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

export function fetchFrequentlyPlayedArtists(): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		console.debug('Fetching frequently played artists')

		try {
			fetchFrequentlyPlayed()
				.then((frequentlyPlayed) => {
					console.debug('Received frequently played artists response')
					return frequentlyPlayed.map((played) => played.ArtistItems![0] as BaseItemDto)
				})
				.then((artists) => {
					resolve(
						artists.filter((item, index, artists) => {
							return index === artists.findIndex((artist) => artist.Id === item.Id)
						}),
					)
				})
		} catch (error) {
			reject(error)
		}
	})
}
