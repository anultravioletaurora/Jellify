import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import QueryConfig from './query.config'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { JellifyLibrary } from '../../types/JellifyLibrary'
import { Api } from '@jellyfin/sdk'

export function fetchAlbums(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	columns: number,
	page: number,
	sortBy: ItemSortBy = ItemSortBy.SortName,
	sortOrder: SortOrder = SortOrder.Ascending,
): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		if (!api) return reject('No API instance provided')
		if (!library) return reject('No library instance provided')

		getItemsApi(api!)
			.getItems({
				includeItemTypes: [BaseItemKind.MusicAlbum],
				recursive: true,
				parentId: library.musicLibraryId,
				sortBy: [sortBy],
				sortOrder: [sortOrder],
				startIndex: page * columns * QueryConfig.limits.library,
				limit: columns * QueryConfig.limits.library,
			})
			.then((response) => {
				return response.data.Items ? resolve(response.data.Items) : resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}
