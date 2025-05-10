import React, { createContext, ReactNode, useContext } from 'react'
import { JellifyDownload } from '../../types/JellifyDownload'
import {
	useMutation,
	UseMutationResult,
	useQuery,
	useQueryClient,
	UseQueryResult,
} from '@tanstack/react-query'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { mapDtoToTrack } from '../../helpers/mappings'
import { deleteAudio, getAudioCache, saveAudio } from '../../components/Network/offlineModeUtils'
import { QueryKeys } from '../../enums/query-keys'
import { networkStatusTypes } from '../../components/Network/internetConnectionWatcher'
import DownloadProgress from '../../types/DownloadProgress'
import { useJellifyContext } from '..'
import { isUndefined } from 'lodash'
import RNFS from 'react-native-fs'
import { JellifyStorage } from './types'

interface NetworkContext {
	useDownload: UseMutationResult<void, Error, BaseItemDto, unknown>
	useRemoveDownload: UseMutationResult<void, Error, BaseItemDto, unknown>
	storageUsage: JellifyStorage | undefined
	downloadedTracks: JellifyDownload[] | undefined
	activeDownloads: DownloadProgress[] | undefined
	networkStatus: networkStatusTypes | undefined
}

const NetworkContextInitializer = () => {
	const { api, sessionId } = useJellifyContext()
	const queryClient = useQueryClient()

	const fetchStorageInUse: () => Promise<JellifyStorage> = async () => {
		const totalStorage = await RNFS.getFSInfo()
		const storageInUse = await RNFS.stat(RNFS.DocumentDirectoryPath)

		return {
			totalStorage: totalStorage.totalSpace,
			freeSpace: totalStorage.freeSpace,
			storageInUseByJellify: storageInUse.size,
		}
	}

	const useDownload = useMutation({
		mutationFn: (trackItem: BaseItemDto) => {
			if (isUndefined(api)) throw new Error('API client not initialized')

			const track = mapDtoToTrack(api, sessionId, trackItem, [])

			return saveAudio(track, queryClient, false)
		},
		onSuccess: (data, variables) => {
			console.debug(`Downloaded ${variables.Id} successfully`)

			refetchDownloadedTracks()
			return data
		},
	})

	const { data: storageUsage } = useQuery({
		queryKey: [QueryKeys.StorageInUse],
		queryFn: () => fetchStorageInUse(),
		staleTime: 1000 * 60 * 60 * 1, // 1 hour
	})

	const useRemoveDownload = useMutation({
		mutationFn: (trackItem: BaseItemDto) => deleteAudio(trackItem),
		onSuccess: (data, { Id }) => {
			console.debug(`Removed ${Id} from storage`)

			refetchDownloadedTracks()
		},
	})

	const { data: networkStatus } = useQuery<networkStatusTypes>({
		queryKey: [QueryKeys.NetworkStatus],
	})

	const { data: activeDownloads } = useQuery<DownloadProgress[]>({
		queryKey: ['downloads'],
		initialData: [],
	})

	const { data: downloadedTracks, refetch: refetchDownloadedTracks } = useQuery({
		queryKey: [QueryKeys.AudioCache],
		queryFn: getAudioCache,
		staleTime: 1000 * 60, // 1 minute
	})

	return {
		useDownload,
		useRemoveDownload,
		activeDownloads,
		downloadedTracks,
		networkStatus,
		storageUsage,
	}
}

const NetworkContext = createContext<NetworkContext>({
	useDownload: {
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
	useRemoveDownload: {
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
	downloadedTracks: [],
	activeDownloads: [],
	networkStatus: networkStatusTypes.ONLINE,
	storageUsage: undefined,
})

export const NetworkContextProvider: ({
	children,
}: {
	children: ReactNode
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
	const context = NetworkContextInitializer()

	return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>
}

export const useNetworkContext = () => useContext(NetworkContext)
