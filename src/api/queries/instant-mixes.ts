import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getInstantMixApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../client'
import { isUndefined } from 'lodash'
import QueryConfig from './query.config'

/**
 * Fetches an instant mix for a given item
 * @param item The item to fetch an instant mix for
 * @returns A promise of a {@link BaseItemDto} array, be it empty or not
 */
export function fetchInstantMixFromItem(item: BaseItemDto): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		if (isUndefined(Client.api)) return reject(new Error('Client not initialized'))

		getInstantMixApi(Client.api)
			.getInstantMixFromArtists({
				itemId: item.Id!,
				userId: Client.user!.id,
				limit: QueryConfig.limits.instantMix,
			})
			.then(({ data }) => {
				if (data.Items) return resolve(data.Items)
				return resolve([])
			})
			.catch((error) => {
				console.error(error)
				return reject(error)
			})
	})
}
