import {
	BaseItemDto,
	BaseItemKind,
	ItemFields,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api'
import QueryConfig from './query.config'
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api'
import { Api } from '@jellyfin/sdk'
import { isUndefined } from 'lodash'
import { JellifyLibrary } from '../../../src/types/JellifyLibrary'
import { JellifyUser } from '@/src/types/JellifyUser'

export async function fetchRecentlyAdded(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	page: number,
): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getUserLibraryApi(api)
			.getLatestMedia({
				parentId: library.musicLibraryId,
				limit: QueryConfig.limits.recents,
			})
			.then(({ data }) => {
				if (data) return resolve(data)
				return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches recently played tracks for a user from the Jellyfin server.
 * @param limit The number of items to fetch. Defaults to 50
 * @param offset The offset of the items to fetch.
 * @returns The recently played items.
 */
export async function fetchRecentlyPlayed(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
	page: number,
	limit: number = QueryConfig.limits.recents,
): Promise<BaseItemDto[]> {
	console.debug('Fetching recently played items')

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.Audio],
				startIndex: page * limit,
				userId: user.id,
				limit,
				parentId: library.musicLibraryId,
				recursive: true,
				sortBy: [ItemSortBy.DatePlayed],
				sortOrder: [SortOrder.Descending],
				fields: [ItemFields.ParentId],
			})
			.then((response) => {
				console.debug('Received recently played items response')

				if (response.data.Items) return resolve(response.data.Items)
				return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches recently played artists for a user from the Jellyfin server,
 * referencing the recently played tracks.
 * @param limit The number of items to fetch. Defaults to 50
 * @param offset The offset of the items to fetch.
 * @returns The recently played artists.
 */
export function fetchRecentlyPlayedArtists(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
	page: number,
): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.MusicArtist],
				parentId: library.musicLibraryId,
				recursive: true,
				limit: 100,
				startIndex: page * 100,
				sortBy: [ItemSortBy.DatePlayed],
				sortOrder: [SortOrder.Descending],
			})
			.then(({ data }) => {
				if (data.Items) return resolve(data.Items)
				else return resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}
