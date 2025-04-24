import { PlaybackInfoResponse } from '@jellyfin/sdk/lib/generated-client/models'
import Client from '../../../api/client'
import { getMediaInfoApi } from '@jellyfin/sdk/lib/utils/api'

export async function fetchMediaInfo(itemId: string): Promise<PlaybackInfoResponse> {
	return new Promise((resolve, reject) => {
		getMediaInfoApi(Client.api!)
			.getPlaybackInfo({
				itemId,
				userId: Client.user?.id,
			})
			.then(({ data }) => {
				console.debug(data)
				resolve(data)
			})
			.catch((error) => {
				reject(error)
			})
	})
}
