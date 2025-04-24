import Client from '../api/client'
import { JellifyTrack } from '../types/JellifyTrack'
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api'
import TrackPlayer, { Event, RatingType } from 'react-native-track-player'
import { getActiveTrack, getActiveTrackIndex } from 'react-native-track-player/lib/src/trackPlayer'
import { SKIP_TO_PREVIOUS_THRESHOLD } from './config'

/**
 * Jellify Playback Service.
 *
 * Sets up event listeners for remote control events and
 * runs for the duration of the app lifecycle
 */
export async function PlaybackService() {
	TrackPlayer.addEventListener(Event.RemotePlay, async () => {
		await TrackPlayer.play()
	})
	TrackPlayer.addEventListener(Event.RemotePause, async () => {
		await TrackPlayer.pause()
	})

	TrackPlayer.addEventListener(Event.RemoteNext, async () => {
		await TrackPlayer.skipToNext()
	})

	TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
		const progress = await TrackPlayer.getProgress()

		if (progress.position < SKIP_TO_PREVIOUS_THRESHOLD) await TrackPlayer.skipToPrevious()
		else await TrackPlayer.seekTo(0)
	})

	TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
		await TrackPlayer.seekTo(event.position)
	})

	// TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
	//     await TrackPlayer.seekBy(event.interval)
	// });

	// TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
	//     await TrackPlayer.seekBy(-event.interval)
	// });

	TrackPlayer.addEventListener(Event.RemoteLike, async () => {
		const nowPlaying = (await getActiveTrack()) as JellifyTrack
		const nowPlayingIndex = await getActiveTrackIndex()

		await getUserLibraryApi(Client.api!).markFavoriteItem({
			itemId: nowPlaying.item.Id!,
		})

		await TrackPlayer.updateMetadataForTrack(nowPlayingIndex!, {
			rating: RatingType.Heart,
		})
	})

	TrackPlayer.addEventListener(Event.RemoteDislike, async () => {
		const nowPlaying = (await getActiveTrack()) as JellifyTrack
		const nowPlayingIndex = await getActiveTrackIndex()

		await getUserLibraryApi(Client.api!).markFavoriteItem({
			itemId: nowPlaying.item.Id!,
		})

		await TrackPlayer.updateMetadataForTrack(nowPlayingIndex!, {
			rating: undefined,
		})
	})
}
