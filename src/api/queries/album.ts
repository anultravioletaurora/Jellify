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
import { fetchItems } from './item'

export function fetchAlbums(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	page: number,
	isFavorite: boolean = false,
	sortBy: ItemSortBy[] = [ItemSortBy.SortName],
	sortOrder: SortOrder[] = [SortOrder.Ascending],
): Promise<BaseItemDto[]> {
	console.debug('Fetching albums', page)

	return fetchItems(api, library, [BaseItemKind.MusicAlbum], page, sortBy, sortOrder, isFavorite)
}
