import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { JellifyTrack } from '../types/JellifyTrack'
import { storage } from '../constants/storage'
import { MMKVStorageKeys } from '../enums/mmkv-storage-keys'
import TrackPlayer, {
	Event,
	State,
	usePlaybackState,
	useTrackPlayerEvents,
} from 'react-native-track-player'
import { handlePlaybackProgressUpdated, handlePlaybackState } from './handlers'
import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { trigger } from 'react-native-haptic-feedback'
import { pause, play, seekBy, seekTo } from 'react-native-track-player/lib/src/trackPlayer'
import { convertRunTimeTicksToSeconds } from '../helpers/runtimeticks'
import Client from '../api/client'

import { getPlaystateApi } from '@jellyfin/sdk/lib/utils/api'
import { useNetworkContext } from '../components/Network/provider'
import { useQueueContext } from './queue-provider'
import { PlaystateApi } from '@jellyfin/sdk/lib/generated-client/api/playstate-api'

interface PlayerContext {
	nowPlaying: JellifyTrack | undefined
	useStartPlayback: UseMutationResult<void, Error, void, unknown>
	useTogglePlayback: UseMutationResult<void, Error, void, unknown>
	useSeekTo: UseMutationResult<void, Error, number, unknown>
	useSeekBy: UseMutationResult<void, Error, number, unknown>
}

const PlayerContextInitializer = () => {
	const nowPlayingJson = storage.getString(MMKVStorageKeys.NowPlaying)

	let playStateApi: PlaystateApi | undefined

	if (Client.api) getPlaystateApi(Client.api)

	//#region State
	const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(
		nowPlayingJson ? JSON.parse(nowPlayingJson) : undefined,
	)

	const { playQueue, currentIndex } = useQueueContext()

	//#endregion State

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

			handlePlaybackProgressUpdated(Client.sessionId, playStateApi, nowPlaying!, {
				buffered: 0,
				position,
				duration: convertRunTimeTicksToSeconds(nowPlaying!.duration!),
			})
		},
	})

	const useSeekBy = useMutation({
		mutationFn: async (seekSeconds: number) => {
			trigger('clockTick')

			await seekBy(seekSeconds)
		},
	})
	//#endregion

	//#region RNTP Setup

	const { state: playbackState } = usePlaybackState()
	const { useDownload, downloadedTracks, networkStatus } = useNetworkContext()

	useTrackPlayerEvents(
		[Event.RemoteLike, Event.RemoteDislike, Event.PlaybackProgressUpdated, Event.PlaybackState],
		async (event) => {
			switch (event.type) {
				case Event.RemoteLike: {
					break
				}

				case Event.RemoteDislike: {
					break
				}

				case Event.PlaybackState: {
					handlePlaybackState(
						Client.sessionId,
						playStateApi,
						(await TrackPlayer.getActiveTrack()) as JellifyTrack,
						event.state,
					)
					break
				}
				case Event.PlaybackProgressUpdated: {
					handlePlaybackProgressUpdated(
						Client.sessionId,
						playStateApi,
						nowPlaying!,
						event,
					)

					// Cache playing track at 20 seconds if it's not already downloaded
					if (
						Math.floor(event.position) === 20 &&
						downloadedTracks?.filter(
							(download) => download.item.Id === nowPlaying!.item.Id,
						).length === 0
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
