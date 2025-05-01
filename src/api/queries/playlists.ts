import Client from '../client'
import { BaseItemDto, ItemSortBy, SortOrder } from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'

export async function fetchUserPlaylists(sortBy: ItemSortBy[] = []): Promise<BaseItemDto[] | void> {
	console.debug(
		`Fetching user playlists ${sortBy.length > 0 ? 'sorting by ' + sortBy.toString() : ''}`,
	)

	const defaultSorting: ItemSortBy[] = [ItemSortBy.IsFolder, ItemSortBy.SortName]

	return await getItemsApi(Client.api!)
		.getItems({
			userId: Client.user!.id,
			parentId: Client.library!.playlistLibraryId!,
			fields: ['Path'],
			sortBy: sortBy.concat(defaultSorting),
			sortOrder: [SortOrder.Ascending],
		})
		.then((response) => {
			console.log(response)

			if (response.data.Items)
				return response.data.Items.filter((playlist) =>
					playlist.Path?.includes('/data/playlists'),
				)
			else return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}

export async function fetchPublicPlaylists(): Promise<BaseItemDto[]> {
	console.debug('Fetching public playlists')

	return await getItemsApi(Client.api!)
		.getItems({
			parentId: Client.library!.playlistLibraryId!,
			sortBy: [ItemSortBy.IsFolder, ItemSortBy.SortName],
			sortOrder: [SortOrder.Ascending],
		})
		.then((response) => {
			console.log(response)

			if (response.data.Items)
				return response.data.Items.filter(
					(playlist) => !playlist.Path?.includes('/data/playlists'),
				)
			else return []
		})
		.catch((error) => {
			console.error(error)
			return []
		})
}
