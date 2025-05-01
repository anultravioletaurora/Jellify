import Client from '../client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getUserViewsApi } from '@jellyfin/sdk/lib/utils/api'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api/items-api'
import { isUndefined } from 'lodash'

export async function fetchMusicLibraries(): Promise<BaseItemDto[] | void> {
	console.debug('Fetching music libraries from Jellyfin')

	const libraries = await getItemsApi(Client.api!).getItems({
		includeItemTypes: ['CollectionFolder'],
	})

	if (isUndefined(libraries.data.Items)) {
		console.warn('No libraries found on Jellyfin')
		return
	}

	const musicLibraries = libraries.data.Items!.filter(
		(library) => library.CollectionType == 'music',
	)

	return musicLibraries
}

export async function fetchPlaylistLibrary(): Promise<BaseItemDto | void> {
	console.debug('Fetching playlist library from Jellyfin')

	const libraries = await getItemsApi(Client.api!).getItems({
		includeItemTypes: ['ManualPlaylistsFolder'],
		excludeItemTypes: ['CollectionFolder'],
	})

	if (isUndefined(libraries.data.Items)) {
		console.warn('No playlist libraries found on Jellyfin')
		return
	}

	console.debug('Playlist libraries', libraries.data.Items!)

	const playlistLibrary = libraries.data.Items!.filter(
		(library) => library.CollectionType == 'playlists',
	)[0]

	if (isUndefined(playlistLibrary)) {
		console.warn('Playlist libary does not exist on server')
		return
	}

	return playlistLibrary
}

export async function fetchUserViews(): Promise<BaseItemDto[] | void> {
	console.debug('Fetching user views')

	return await getUserViewsApi(Client.api!)
		.getUserViews({
			userId: Client.user!.id,
		})
		.then((response) => {
			if (response.data.Items) return response.data.Items
			else return []
		})
		.catch((error) => {
			console.warn(error)
		})
}
