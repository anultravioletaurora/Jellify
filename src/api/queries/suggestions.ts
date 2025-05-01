import { getItemsApi, getSuggestionsApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../client'
import { BaseItemDto, BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models'

export async function fetchSearchSuggestions(): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		getItemsApi(Client.api!)
			.getItems({
				recursive: true,
				limit: 10,
				includeItemTypes: [
					BaseItemKind.MusicArtist,
					BaseItemKind.Playlist,
					BaseItemKind.Audio,
					BaseItemKind.MusicAlbum,
				],
				sortBy: ['IsFavoriteOrLiked', 'Random'],
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

/**
 * @deprecated Use Items API based functions instead of Suggestions API
 * @returns
 */
export async function fetchSuggestedArtists(): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		getSuggestionsApi(Client.api!)
			.getSuggestions({
				userId: Client.user!.id,
				type: ['MusicArtist'],
			})
			.then((response) => {
				if (response.data.Items) resolve(response.data.Items)
				else resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

/**
 * @deprecated Use Items API based functions instead of Suggestions API
 * @returns
 */
export async function fetchSuggestedAlbums(): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		getSuggestionsApi(Client.api!)
			.getSuggestions({
				userId: Client.user!.id,
				type: ['MusicAlbum'],
			})
			.then((response) => {
				if (response.data.Items) resolve(response.data.Items)
				else resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}

/**
 * @deprecated Use Items API based functions instead of Suggestions API
 * @returns
 */
export async function fetchSuggestedTracks(): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		getSuggestionsApi(Client.api!)
			.getSuggestions({
				userId: Client.user!.id,
				type: ['Audio'],
			})
			.then((response) => {
				if (response.data.Items) resolve(response.data.Items)
				else resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}
