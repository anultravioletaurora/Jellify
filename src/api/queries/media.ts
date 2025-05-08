import { Api } from '@jellyfin/sdk'
import { BaseItemDto, PlaybackInfoResponse } from '@jellyfin/sdk/lib/generated-client/models'
import { getAudioApi, getMediaInfoApi } from '@jellyfin/sdk/lib/utils/api'
import { isUndefined } from 'lodash'
import { JellifyUser } from '../../types/JellifyUser'
export async function fetchMediaInfo(
	api: Api | undefined,
	user: JellifyUser | undefined,
	item: BaseItemDto,
): Promise<PlaybackInfoResponse> {
	return new Promise((resolve, reject) => {
		if (isUndefined(api)) return reject('Client instance not set')
		if (isUndefined(user)) return reject('User instance not set')

		if (item.Type !== 'Audio') return resolve({})

		getMediaInfoApi(api)
			.getPlaybackInfo({
				itemId: item.Id!,
				userId: user.id,
			})
			.then(({ data }) => {
				console.debug('Received media info response')
				resolve(data)
			})
			.catch((error) => {
				reject(error)
			})
	})
}
