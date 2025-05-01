import Client from '../client'
import { BaseItemDto, ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { groupBy, isEmpty, isEqual, isUndefined } from 'lodash'

export async function fetchItem(itemId: string): Promise<BaseItemDto> {
	return new Promise((resolve, reject) => {
		if (isEmpty(itemId)) reject('No item ID proviced')

		getItemsApi(Client.api!)
			.getItems({
				ids: [itemId],
			})
			.then((response) => {
				if (response.data.Items && response.data.TotalRecordCount == 1)
					resolve(response.data.Items[0])
				else reject(`${response.data.TotalRecordCount} items returned for ID`)
			})
	})
}

export async function fetchAlbumDiscs(
	album: BaseItemDto,
): Promise<{ title: string; data: BaseItemDto[] }[]> {
	return new Promise<{ title: string; data: BaseItemDto[] }[]>((resolve, reject) => {
		if (isEmpty(album.Id)) reject('No album ID provided')

		if (isUndefined(Client.api)) reject('Client not initialized')

		let sortBy: ItemSortBy[] = []

		sortBy = [ItemSortBy.ParentIndexNumber, ItemSortBy.IndexNumber, ItemSortBy.SortName]

		getItemsApi(Client.api!)
			.getItems({
				parentId: album.Id!,
				sortBy,
			})
			.then(({ data }) => {
				const discs = data.Items
					? Object.keys(groupBy(data.Items, (track) => track.ParentIndexNumber)).map(
							(discNumber) => {
								console.debug(discNumber)
								return {
									title: discNumber,
									data: data.Items!.filter((track: BaseItemDto) =>
										track.ParentIndexNumber
											? isEqual(
													discNumber,
													(track.ParentIndexNumber ?? 0).toString(),
												)
											: track,
									),
								}
							},
						)
					: [{ title: '1', data: [] }]

				resolve(discs)
			})
			.catch((error) => {
				reject(error)
			})
	})
}
