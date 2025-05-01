import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api'
import QueryConfig from './query.config'
import Client from '../client'
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api'

export async function fetchRecentlyAdded(
	limit: number = QueryConfig.limits.recents,
	offset?: number | undefined,
): Promise<BaseItemDto[]> {
	if (!Client.api) {
		console.error('Client not set')
		return []
	}
	if (!Client.library) return []
	return await getUserLibraryApi(Client.api)
		.getLatestMedia({
			parentId: Client.library.musicLibraryId,
			limit,
		})
		.then(({ data }) => {
			return offset ? data.slice(offset, data.length - 1) : data
		})
}

export async function fetchRecentlyPlayed(
	limit: number = QueryConfig.limits.recents,
	offset?: number | undefined,
): Promise<BaseItemDto[]> {
	console.debug('Fetching recently played items')

	return await getItemsApi(Client.api!)
		.getItems({
			includeItemTypes: [BaseItemKind.Audio],
			startIndex: offset,
			limit,
			parentId: Client.library!.musicLibraryId,
			recursive: true,
			sortBy: [ItemSortBy.DatePlayed],
			sortOrder: [SortOrder.Descending],
		})
		.then((response) => {
			console.debug('Received recently played items response')

			if (response.data.Items) return response.data.Items
			return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}

export function fetchRecentlyPlayedArtists(
	limit: number = QueryConfig.limits.recents,
	offset?: number | undefined,
): Promise<BaseItemDto[]> {
	return fetchRecentlyPlayed(limit * 2, offset ? offset + 10 : undefined).then((tracks) => {
		return getItemsApi(Client.api!)
			.getItems({
				ids: tracks.map((track) => track.ArtistItems![0].Id!),
			})
			.then((recentArtists) => {
				return recentArtists.data.Items!
			})
	})
}
