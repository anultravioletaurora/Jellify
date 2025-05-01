import { BaseItemDto, MediaType } from '@jellyfin/sdk/lib/generated-client/models'
import Client from '../client'
import { getLibraryApi, getPlaylistsApi } from '@jellyfin/sdk/lib/utils/api'

export async function addToPlaylist(track: BaseItemDto, playlist: BaseItemDto) {
	console.debug('Adding track to playlist')

	return getPlaylistsApi(Client.api!).addItemToPlaylist({
		ids: [track.Id!],
		playlistId: playlist.Id!,
	})
}

export async function removeFromPlaylist(track: BaseItemDto, playlist: BaseItemDto) {
	console.debug('Removing track from playlist')

	return getPlaylistsApi(Client.api!).removeItemFromPlaylist({
		playlistId: playlist.Id!,
		entryIds: [track.Id!],
	})
}

export async function reorderPlaylist(playlistId: string, itemId: string, to: number) {
	console.debug(`Moving track to index ${to}`)

	return getPlaylistsApi(Client.api!).moveItem({
		playlistId,
		itemId,
		newIndex: to,
	})
}

export async function createPlaylist(name: string) {
	console.debug('Creating new playlist...')

	return getPlaylistsApi(Client.api!).createPlaylist({
		userId: Client.user!.id,
		mediaType: MediaType.Audio,
		createPlaylistDto: {
			Name: name,
			IsPublic: false,
			MediaType: MediaType.Audio,
		},
	})
}

export async function deletePlaylist(playlistId: string) {
	console.debug('Deleting playlist...')

	return getLibraryApi(Client.api!).deleteItem({
		itemId: playlistId,
	})
}

/**
 * Updates a Jellyfin playlist with the provided options.
 *
 * Right now this just supports renaming playlists, but this will change
 * when it comes time for collaborative playlists
 *
 * @param playlistId The Jellyfin ID of the playlist to update
 * @returns
 */
export async function updatePlaylist(playlistId: string, name: string, trackIds: string[]) {
	console.debug('Updating playlist')

	return getPlaylistsApi(Client.api!).updatePlaylist({
		playlistId,
		updatePlaylistDto: {
			Name: name,
			Ids: trackIds,
		},
	})
}
