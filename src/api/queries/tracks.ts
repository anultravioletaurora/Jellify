import { JellifyLibrary } from '@/src/types/JellifyLibrary'
import { Api } from '@jellyfin/sdk'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { isUndefined } from 'lodash'

export function fetchTracks(
	api: Api | undefined,
	library: JellifyLibrary | undefined,
	numberOfColumns: number,
	pageParam: number,
) {
	return new Promise<BaseItemDto[]>((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(library)) return reject('Library instance not set')

		getItemsApi(api)
			.getItems({
				includeItemTypes: [BaseItemKind.Audio],
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
