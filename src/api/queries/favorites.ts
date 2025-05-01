import Client from '../client'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
	UserItemDataDto,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'

export async function fetchFavoriteArtists(): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite artists`)
	return await getItemsApi(Client.api!)
		.getItems({
			includeItemTypes: [BaseItemKind.MusicArtist],
			isFavorite: true,
			parentId: Client.library!.musicLibraryId,
			recursive: true,
			sortBy: [ItemSortBy.SortName],
			sortOrder: [SortOrder.Ascending],
		})
		.then((response) => {
			console.debug(`Received favorite artist response`, response)

			if (response.data.Items) return response.data.Items
			else return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}

export async function fetchFavoriteAlbums(): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite albums`)

	return await getItemsApi(Client.api!)
		.getItems({
			includeItemTypes: [BaseItemKind.MusicAlbum],
			isFavorite: true,
			parentId: Client.library!.musicLibraryId!,
			recursive: true,
			sortBy: [ItemSortBy.DatePlayed, ItemSortBy.SortName],
			sortOrder: [SortOrder.Descending, SortOrder.Ascending],
		})
		.then((response) => {
			console.debug(`Received favorite album response`, response)

			if (response.data.Items) return response.data.Items
			else return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}

export async function fetchFavoritePlaylists(): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite playlists`)

	return await getItemsApi(Client.api!)
		.getItems({
			userId: Client.user!.id,
			parentId: Client.library!.playlistLibraryId,
			fields: ['Path'],
			sortBy: [ItemSortBy.SortName],
			sortOrder: [SortOrder.Ascending],
		})
		.then((response) => {
			console.log(response)
			if (response.data.Items)
				return response.data.Items.filter(
					(item) => item.UserData?.IsFavorite || item.Path?.includes('/data/playlists'),
				)
			else return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}

export async function fetchFavoriteTracks(): Promise<BaseItemDto[]> {
	console.debug(`Fetching user's favorite tracks`)
	return await getItemsApi(Client.api!)
		.getItems({
			includeItemTypes: [BaseItemKind.Audio],
			isFavorite: true,
			parentId: Client.library!.musicLibraryId,
			recursive: true,
			sortBy: [ItemSortBy.SortName],
			sortOrder: [SortOrder.Ascending],
		})
		.then((response) => {
			console.debug(`Received favorite artist response`, response)

			if (response.data.Items) return response.data.Items
			else return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}

export async function fetchUserData(itemId: string): Promise<UserItemDataDto | void> {
	return await getItemsApi(Client.api!)
		.getItemUserData({
			itemId,
		})
		.then((response) => {
			return response.data
		})
		.catch((error) => {
			console.error(error)
		})
}
