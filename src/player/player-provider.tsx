import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { JellifyTrack } from '../types/JellifyTrack'
import { storage } from '../constants/storage'
import { MMKVStorageKeys } from '../enums/mmkv-storage-keys'
import TrackPlayer, {
	Event,
	Progress,
	State,
	usePlaybackState,
	useTrackPlayerEvents,
} from 'react-native-track-player'
import { handlePlaybackProgress, handlePlaybackState } from './handlers'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { trigger } from 'react-native-haptic-feedback'
import { pause, play, seekBy, seekTo } from 'react-native-track-player/lib/src/trackPlayer'

import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api'
import { useNetworkContext } from '../components/Network/provider'
import { useQueueContext } from './queue-provider'
import { PlaystateApi } from '@jellyfin/sdk/lib/generated-client/api/playstate-api'
import { networkStatusTypes } from '../components/Network/internetConnectionWatcher'
import { useJellifyContext } from '../components/provider'
import { isUndefined } from 'lodash'

interface PlayerContext {
	nowPlaying: JellifyTrack | undefined
	playbackState: State | undefined
	useStartPlayback: UseMutationResult<void, Error, void, unknown>
	useTogglePlayback: UseMutationResult<void, Error, void, unknown>
	useSeekTo: UseMutationResult<void, Error, number, unknown>
	useSeekBy: UseMutationResult<void, Error, number, unknown>
}

const PlayerContextInitializer = () => {
	const { api, sessionId } = useJellifyContext()
	const { playQueue, currentIndex, queueRef } = useQueueContext()

	const nowPlayingJson = storage.getString(MMKVStorageKeys.NowPlaying)

	/**
	 * A Jellyfin {@link PlaystateApi} instance. Used to report playback state and progress
	 * to Jellyfin.
	 */
	let playStateApi: PlaystateApi | undefined

	/**
	 * Initialize the {@link playStateApi} instance.
	 */
	if (!isUndefined(api)) playStateApi = getPlaystateApi(api)

	//#region State
	const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(
		nowPlayingJson ? JSON.parse(nowPlayingJson) : undefined,
	)

	const [initialized, setInitialized] = useState<boolean>(false)

	//#endregion State

	//#region Functions
	const handlePlaybackStateChanged = async (state: State) => {
		if (playStateApi && nowPlaying)
			await handlePlaybackState(sessionId, playStateApi, nowPlaying, state)
	}

	/**
	 * A function to handle reporting playback progress to Jellyfin. Does nothing if
	 * the {@link playStateApi} or {@link nowPlaying} are not defined.
	 */
	const handlePlaybackProgressUpdated = async (progress: Progress) => {
		if (playStateApi && nowPlaying)
			await handlePlaybackProgress(sessionId, playStateApi, nowPlaying, progress)
	}

	//#endregion Functions

	//#region Hooks
	/**
	 * A mutation to handle starting playback
	 */
	const useStartPlayback = useMutation({
		mutationFn: play,
	})

	/**
	 * A mutation to handle toggling the playback state
	 */
	const useTogglePlayback = useMutation({
		mutationFn: () => {
			trigger('impactMedium')
			if (playbackState === State.Playing) return pause()
			else return play()
		},
	})

	/**
	 * A mutation to handle seeking to a specific position in the track
	 */
	const useSeekTo = useMutation({
		mutationFn: async (position: number) => {
			trigger('impactLight')
			await seekTo(position)
		},
	})

	/**
	 * A mutation to handle seeking to a specific position in the track
	 */
	const useSeekBy = useMutation({
		mutationFn: async (seekSeconds: number) => {
			trigger('clockTick')

			await seekBy(seekSeconds)
		},
	})

	/**
	 * A mutation to handle reporting playback state to Jellyfin
	 */
	const usePlaybackStateChanged = useMutation({
		mutationFn: async (state: State) => handlePlaybackStateChanged(state),
	})

	/**
	 * A mutation to handle reporting playback progress to Jellyfin
	 */
	const usePlaybackProgressUpdated = useMutation({
		mutationFn: async (progress: Progress) => handlePlaybackProgressUpdated(progress),
	})
	//#endregion

	//#region RNTP Setup

	const { state: playbackState } = usePlaybackState()
	const { useDownload, downloadedTracks, networkStatus } = useNetworkContext()

	/**
	 * Use the {@link useTrackPlayerEvents} hook to listen for events from the player.
	 *
	 * This is use to report playback status to Jellyfin, and as such the player context
	 * is only concerned about the playback state and progress.
	 */
	useTrackPlayerEvents(
		[Event.RemoteLike, Event.RemoteDislike, Event.PlaybackProgressUpdated, Event.PlaybackState],
		(event) => {
			switch (event.type) {
				case Event.PlaybackState: {
					usePlaybackStateChanged.mutate(event.state)
					break
				}
				case Event.PlaybackProgressUpdated: {
					usePlaybackProgressUpdated.mutate(event)

					// Cache playing track at 20 seconds if it's not already downloaded
					if (
						Math.floor(event.position) === 20 &&
						downloadedTracks?.filter(
							(download) => download.item.Id === nowPlaying!.item.Id,
						).length === 0 &&
						networkStatus === networkStatusTypes.ONLINE
					)
						useDownload.mutate(nowPlaying!.item)

					break
				}
			}
		},
	)

	//#endregion RNTP Setup

	//#region useEffects
	/**
	 * Store the now playing track in storage when it changes
	 */
	useEffect(() => {
		if (nowPlaying) storage.set(MMKVStorageKeys.NowPlaying, JSON.stringify(nowPlaying))
	}, [nowPlaying])

	/**
	 * Set the now playing track to the track at the current index in the play queue
	 */
	useEffect(() => {
		if (currentIndex > -1 && playQueue.length > currentIndex) {
			console.debug(`Setting now playing to queue index ${currentIndex}`)
			setNowPlaying(playQueue[currentIndex])
		}
	}, [currentIndex, playQueue])

	/**
	 * Initialize the player. This is used to load the queue from the {@link QueueProvider}
	 * and set it to the player if we have already completed the onboarding process
	 * and the user has a valid queue in storage
	 */
	useEffect(() => {
		console.debug('Initialized', initialized)
		console.debug('Play queue length', playQueue.length)
		console.debug('Current index', currentIndex)
		if (playQueue.length > 0 && currentIndex > -1 && !initialized) {
			TrackPlayer.setQueue(playQueue)
			TrackPlayer.skip(currentIndex)
			console.debug('Loaded queue from storage')
			setInitialized(true)
		} else if (queueRef === 'Recently Played' && currentIndex === -1) {
			console.debug('Not loading queue as it is empty')
			setInitialized(true)
		}
	}, [])
	//#endregion useEffects

	//#region return
	return {
		nowPlaying,
		useStartPlayback,
		useTogglePlayback,
		useSeekTo,
		useSeekBy,
		playbackState,
	}
	//#endregion return
}

//#region Create PlayerContext
/**
 * Context for the player. This is used to provide the player context to the
 * player components.
 * @param param0 The default {@link PlayerContext}
 * @returns The default {@link PlayerContext}
 */
export const PlayerContext = createContext<PlayerContext>({
	nowPlaying: undefined,
	playbackState: undefined,
	useStartPlayback: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useTogglePlayback: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useSeekTo: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
	useSeekBy: {
		mutate: () => {},
		mutateAsync: async () => {},
		data: undefined,
		error: null,
		variables: undefined,
		isError: false,
		isIdle: true,
		isPaused: false,
		isPending: false,
		isSuccess: false,
		status: 'idle',
		reset: () => {},
		context: {},
		failureCount: 0,
		failureReason: null,
		submittedAt: 0,
	},
})
//#endregion Create PlayerContext

/**
 * Provider for the player context. This is used to provide player controls and the currently
 * playing track to child components.
 * @param param0 The {@link ReactNode} to render
 * @returns A {@link ReactNode}
 */
export const PlayerProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const context = PlayerContextInitializer()

	return <PlayerContext.Provider value={context}>{children}</PlayerContext.Provider>
}

/**
 * Hook to use the player context. This is used to get the player context from the
 * {@link PlayerProvider}.
 * @returns The {@link PlayerContext}
 */
export const usePlayerContext = () => useContext(PlayerContext)
