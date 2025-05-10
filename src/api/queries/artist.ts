import { JellifyLibrary } from '@/src/types/JellifyLibrary'
import { Api } from '@jellyfin/sdk/lib/api'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { fetchItems } from './item'

export function fetchArtists(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	page: number,
	isFavorite: boolean,
	sortBy: ItemSortBy[] = [ItemSortBy.SortName],
	sortOrder: SortOrder[] = [SortOrder.Ascending],
): Promise<BaseItemDto[]> {
	console.debug('Fetching artists', page)
	return fetchItems(api, library, [BaseItemKind.MusicArtist], page, sortBy, sortOrder, isFavorite)
}

/**
 * Fetches all albums for an artist
 * @param api The Jellyfin {@link Api} instance
 * @param artist The artist to fetch albums for
 * @returns A promise that resolves to an array of {@link BaseItemDto}s
 */
export function fetchArtistAlbums(
	api: Api | undefined,
	artist: BaseItemDto,
): Promise<BaseItemDto[]> {
	console.debug('Fetching artist albums')

	return new Promise((resolve, reject) => {
		if (!api) return reject('No API instance provided')

		getItemsApi(api!)
			.getItems({
				includeItemTypes: [BaseItemKind.MusicAlbum],
				recursive: true,
				excludeItemIds: [artist.Id!],
				sortBy: [ItemSortBy.PremiereDate, ItemSortBy.ProductionYear, ItemSortBy.SortName],
				sortOrder: [SortOrder.Descending],
				albumArtistIds: [artist.Id!],
			})
			.then((response) => {
				return response.data.Items ? resolve(response.data.Items) : resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

/**
 * Fetches all albums that an artist is featured on
 * @param api The Jellyfin {@link Api} instance
 * @param artist The artist to fetch featured albums for
 * @returns A promise that resolves to an array of {@link BaseItemDto}s
 */
export function fetchArtistFeaturedOn(
	api: Api | undefined,
	artist: BaseItemDto,
): Promise<BaseItemDto[]> {
	console.debug('Fetching artist featured on')

	return new Promise((resolve, reject) => {
		if (!api) return reject('No API instance provided')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.MusicAlbum],
				recursive: true,
				excludeItemIds: [artist.Id!],
				sortBy: [ItemSortBy.PremiereDate, ItemSortBy.ProductionYear, ItemSortBy.SortName],
				sortOrder: [SortOrder.Descending],
				contributingArtistIds: [artist.Id!],
			})
			.then((response) => {
				return response.data.Items ? resolve(response.data.Items) : resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}
