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
	page: string,
	isFavorite: boolean = false,
	sortBy: ItemSortBy[] = [ItemSortBy.SortName],
	sortOrder: SortOrder[] = [SortOrder.Ascending],
): Promise<{ title: string | number; data: BaseItemDto[] }> {
	console.debug('Fetching albums', page)

	return fetchItems(api, library, [BaseItemKind.MusicAlbum], page, sortBy, sortOrder, isFavorite)
}
