import {
	BaseItemDto,
	ImageType,
	PlaybackInfoResponse,
} from '@jellyfin/sdk/lib/generated-client/models'
import { JellifyTrack } from '../types/JellifyTrack'
import { RatingType, TrackType } from 'react-native-track-player'
import { QueuingType } from '../enums/queuing-type'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../api/client'
import { isUndefined } from 'lodash'
import { JellifyDownload } from '../types/JellifyDownload'
import { queryClient } from '../constants/query-client'
import { QueryKeys } from '../enums/query-keys'

/**
 * The container that the Jellyfin server will attempt to transcode to
 *
 * This is set to `ts` (MPEG-TS), as that is what HLS relies upon
 *
 * Finamp and Jellyfin Web also have this set to `ts`
 * @see https://jmshrv.com/posts/jellyfin-api/#playback-in-the-case-of-music
 */
const transcodingContainer = 'ts'

/**
 * A mapper function that can be used to get a RNTP `Track` compliant object
 * from a Jellyfin server `BaseItemDto`. Applies a queuing type to the track
 * object so that it can be referenced later on for determining where to place
 * the track in the queue
 *
 * @param item The `BaseItemDto` of the track
 * @param queuingType The type of queuing we are performing
 * @returns A `JellifyTrack`, which represents a Jellyfin library track queued in the player
 */
export function mapDtoToTrack(
	item: BaseItemDto,
	downloadedTracks: JellifyDownload[],
	queuingType?: QueuingType,
): JellifyTrack {
	const urlParams = {
		Container: item.Container!,
		TranscodingContainer: transcodingContainer,
		EnableRemoteMedia: 'true',
		EnableRedirection: 'true',
		api_key: Client.api!.accessToken,
		StartTimeTicks: '0',
		PlaySessionId: Client.sessionId,
	}

	console.debug(`Mapping BaseItemDTO to Track object`)
	const isFavorite = !isUndefined(item.UserData) && (item.UserData.IsFavorite ?? false)

	const downloads = downloadedTracks.filter((download) => download.item.Id === item.Id)

	let url: string

	if (downloads.length > 0 && downloads[0].path) url = downloads[0].path
	else {
		const PlaybackInfoResponse = queryClient.getQueryData([
			QueryKeys.MediaSources,
			item.Id!,
		]) as PlaybackInfoResponse | undefined

		if (
			PlaybackInfoResponse &&
			PlaybackInfoResponse.MediaSources &&
			PlaybackInfoResponse.MediaSources[0].TranscodingUrl
		)
			url = PlaybackInfoResponse.MediaSources![0].TranscodingUrl
		else
			url = `${Client.api!.basePath}/Audio/${item.Id!}/universal?${new URLSearchParams(
				urlParams,
			)}`
	}

	console.debug(url.length)
	return {
		url,
		type: TrackType.Default,
		headers: {
			'X-Emby-Token': Client.api!.accessToken,
		},
		title: item.Name,
		album: item.Album,
		artist: item.Artists?.join(', '),
		duration: item.RunTimeTicks,
		artwork: item.AlbumId
			? getImageApi(Client.api!).getItemImageUrlById(item.AlbumId, ImageType.Primary, {
					width: 300,
					height: 300,
				})
			: undefined,

		rating: isFavorite ? RatingType.Heart : undefined,
		item,
		QueuingType: queuingType ?? QueuingType.DirectlyQueued,
	} as JellifyTrack
}
