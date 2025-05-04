import { JellifyLibrary } from '../../../src/types/JellifyLibrary'
import { JellifyUser } from '../../types/JellifyUser'
import { Api } from '@jellyfin/sdk'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
	UserItemDataDto,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { isUndefined } from 'lodash'

/**
 * Fetches the {@link BaseItemDto}s that are marked as favorite artists
 * @param api The Jellyfin {@link Api} instance
 * @param user The Jellyfin {@link JellifyUser} instance
 * @param library The Jellyfin {@link JellifyLibrary} instance
 * @returns The {@link BaseItemDto}s that are marked as favorite artists
 */
export async function fetchFavoriteArtists(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite artists`)

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.MusicArtist],
				isFavorite: true,
				parentId: library.musicLibraryId,
				recursive: true,
				sortBy: [ItemSortBy.SortName],
				sortOrder: [SortOrder.Ascending],
			})
			.then((response) => {
				console.debug(`Received favorite artist response`, response)

				if (response.data.Items) return resolve(response.data.Items)
				else return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches the {@link BaseItemDto}s that are marked as favorite albums
 * @param api The Jellyfin {@link Api} instance
 * @param user The Jellyfin {@link JellifyUser} instance
 * @param library The Jellyfin {@link JellifyLibrary} instance
 * @returns The {@link BaseItemDto}s that are marked as favorite albums
 */
export async function fetchFavoriteAlbums(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite albums`)

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.MusicAlbum],
				isFavorite: true,
				parentId: library.musicLibraryId!,
				recursive: true,
				sortBy: [ItemSortBy.DatePlayed, ItemSortBy.SortName],
				sortOrder: [SortOrder.Descending, SortOrder.Ascending],
			})
			.then((response) => {
				console.debug(`Received favorite album response`, response)

				if (response.data.Items) return resolve(response.data.Items)
				else return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches the {@link BaseItemDto}s that are marked as favorite playlists
 * @param api The Jellyfin {@link Api} instance
 * @param user The Jellyfin {@link JellifyUser} instance
 * @param library The Jellyfin {@link JellifyLibrary} instance
 * @returns The {@link BaseItemDto}s that are marked as favorite playlists
 */
export async function fetchFavoritePlaylists(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite playlists`)

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				userId: user.id,
				parentId: library.playlistLibraryId,
				fields: ['Path'],
				sortBy: [ItemSortBy.SortName],
				sortOrder: [SortOrder.Ascending],
			})
			.then((response) => {
				console.log(response)
				if (response.data.Items)
					return resolve(
						response.data.Items.filter(
							(item) =>
								item.UserData?.IsFavorite || item.Path?.includes('/data/playlists'),
						),
					)
				else return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches the {@link BaseItemDto}s that are marked as favorite tracks
 * @param api The Jellyfin {@link Api} instance
 * @param user The Jellyfin {@link JellifyUser} instance
 * @param library The Jellyfin {@link JellifyLibrary} instance
 * @returns The {@link BaseItemDto}s that are marked as favorite tracks
 */
export async function fetchFavoriteTracks(
	api: Api | undefined,
	user: JellifyUser | undefined,
	library: JellifyLibrary | undefined,
): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite tracks`)

	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.Audio],
				isFavorite: true,
				parentId: library.musicLibraryId,
				recursive: true,
				sortBy: [ItemSortBy.SortName],
				sortOrder: [SortOrder.Ascending],
			})
			.then((response) => {
				console.debug(`Received favorite artist response`, response)

				if (response.data.Items) return resolve(response.data.Items)
				else return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}

/**
 * Fetches the {@link UserItemDataDto} for a given {@link BaseItemDto}
 * @param api The Jellyfin {@link Api} instance
 * @param itemId The ID field of the {@link BaseItemDto} to fetch user data for
 * @returns The {@link UserItemDataDto} for the given item
 */
export async function fetchUserData(
	api: Api | undefined,
	user: JellifyUser | undefined,
	itemId: string,
): Promise<UserItemDataDto | void> {
	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')

		getItemsApi(api)
			.getItemUserData({
				itemId,
				userId: user.id,
			})
			.then((response) => {
				return resolve(response.data)
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}
