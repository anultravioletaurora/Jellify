import _, { isUndefined } from 'lodash'
import { JellifyTrack } from '../../types/JellifyTrack'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { JellifyDownload } from '../../types/JellifyDownload'
import { networkStatusTypes } from '../../components/Network/internetConnectionWatcher'

export function buildNewQueue(
	existingQueue: JellifyTrack[],
	tracksToInsert: JellifyTrack[],
	insertIndex: number,
) {
	console.debug(`Building new queue`)

	let newQueue: JellifyTrack[] = []

	if (_.isEmpty(existingQueue)) newQueue = tracksToInsert
	else {
		newQueue = _.cloneDeep(existingQueue).splice(insertIndex, 0, ...tracksToInsert)
	}

	console.debug(`Built new queue of ${newQueue.length} items`)

	return newQueue
}

export function filterTracksOnNetworkStatus(
	networkStatus: networkStatusTypes | undefined,
	queuedItems: BaseItemDto[],
	downloadedTracks: JellifyDownload[],
) {
	if (isUndefined(networkStatus) || networkStatus === networkStatusTypes.ONLINE)
		return queuedItems
	else
		return queuedItems.filter((item) =>
			downloadedTracks.map((download) => download.item.Id).includes(item.Id),
		)
}
