import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { JellifyTrack } from '../types/JellifyTrack'
import { storage } from '../constants/storage'
import { MMKVStorageKeys } from '../enums/mmkv-storage-keys'
import {
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
import Client from '../api/client'

import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api'
import { useNetworkContext } from '../components/Network/provider'
import { useQueueContext } from './queue-provider'
import { PlaystateApi } from '@jellyfin/sdk/lib/generated-client/api/playstate-api'
import { networkStatusTypes } from '../components/Network/internetConnectionWatcher'

interface PlayerContext {
	nowPlaying: JellifyTrack | undefined
	playbackState: State | undefined
	useStartPlayback: UseMutationResult<void, Error, void, unknown>
	useTogglePlayback: UseMutationResult<void, Error, void, unknown>
	useSeekTo: UseMutationResult<void, Error, number, unknown>
	useSeekBy: UseMutationResult<void, Error, number, unknown>
}

const PlayerContextInitializer = () => {
	const nowPlayingJson = storage.getString(MMKVStorageKeys.NowPlaying)

	let playStateApi: PlaystateApi | undefined

	if (Client.api) playStateApi = getPlaystateApi(Client.api)

	//#region State
	const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(
		nowPlayingJson ? JSON.parse(nowPlayingJson) : undefined,
	)

	const { playQueue, currentIndex } = useQueueContext()

	//#endregion State

	//#region Functions
	const handlePlaybackStateChanged = async (state: State) => {
		if (playStateApi && nowPlaying)
			await handlePlaybackState(Client.sessionId, playStateApi, nowPlaying, state)
	}

	const handlePlaybackProgressUpdated = async (progress: Progress) => {
		if (playStateApi && nowPlaying)
			await handlePlaybackProgress(Client.sessionId, playStateApi, nowPlaying, progress)
	}

	//#endregion Functions

	//#region Hooks
	const useStartPlayback = useMutation({
		mutationFn: play,
	})

	const useTogglePlayback = useMutation({
		mutationFn: () => {
			trigger('impactMedium')
			if (playbackState === State.Playing) return pause()
			else return play()
		},
	})

	const useSeekTo = useMutation({
		mutationFn: async (position: number) => {
			trigger('impactLight')
			await seekTo(position)
		},
	})

	const useSeekBy = useMutation({
		mutationFn: async (seekSeconds: number) => {
			trigger('clockTick')

			await seekBy(seekSeconds)
		},
	})

	const usePlaybackStateChanged = useMutation({
		mutationFn: async (state: State) => handlePlaybackStateChanged(state),
	})

	const usePlaybackProgressUpdated = useMutation({
		mutationFn: async (progress: Progress) => handlePlaybackProgressUpdated(progress),
	})
	//#endregion

	//#region RNTP Setup

	const { state: playbackState } = usePlaybackState()
	const { useDownload, downloadedTracks, networkStatus } = useNetworkContext()

	useTrackPlayerEvents(
		[Event.RemoteLike, Event.RemoteDislike, Event.PlaybackProgressUpdated, Event.PlaybackState],
		(event) => {
			switch (event.type) {
				case Event.RemoteLike: {
					break
				}

				case Event.RemoteDislike: {
					break
				}

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

	useEffect(() => {
		if (nowPlaying) storage.set(MMKVStorageKeys.NowPlaying, JSON.stringify(nowPlaying))
	}, [nowPlaying])

	useEffect(() => {
		if (currentIndex > -1 && playQueue.length > currentIndex) {
			console.debug(`Setting now playing to queue index ${currentIndex}`)
			setNowPlaying(playQueue[currentIndex])
		}
	}, [currentIndex])

	// Prefetch next track for gapless playback
	useEffect(() => {
		if (currentIndex > -1) {
			const nextIndex = currentIndex + 1
			if (nextIndex < playQueue.length) {
				const nextTrack = playQueue[nextIndex]
				const isAlreadyDownloaded =
					downloadedTracks?.some((d) => d.item.Id === nextTrack.item.Id) ?? false
				if (!isAlreadyDownloaded && networkStatus === networkStatusTypes.ONLINE) {
					useDownload.mutate(nextTrack.item)
				}
			}
		}
	}, [currentIndex, downloadedTracks, networkStatus, playQueue])
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

export const PlayerProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const context = PlayerContextInitializer()

	return <PlayerContext.Provider value={context}>{children}</PlayerContext.Provider>
}

export const usePlayerContext = () => useContext(PlayerContext)
