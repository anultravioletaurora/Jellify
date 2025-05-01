import Client from '../client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { isUndefined } from 'lodash'

/**
 * Manually marks an item as played.
 * This should only be used for non-tracks,
 * as those playbacks will be handled by the server
 *
 * This is mainly used for marking playlists
 * and albums as played, so we can use Jellyfin
 * to fetch recent ones later on
 *
 * @param item The item to mark as played
 */
export async function markItemPlayed(item: BaseItemDto): Promise<void> {
	return new Promise((resolve, reject) => {
		if (isUndefined(Client.api) || isUndefined(Client.user))
			return reject('Client instance not set')

		getItemsApi(Client.api)
			.updateItemUserData({
				itemId: item.Id!,
				userId: Client.user.id,
				updateUserItemDataDto: {
					LastPlayedDate: new Date().getUTCDate().toLocaleString(),
					Played: true,
				},
			})
			.then(({ data }) => {
				resolve()
			})
			.catch((error) => {
				reject(error)
			})
	})
}
