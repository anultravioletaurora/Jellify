import React, { createContext, ReactNode, useContext, useState } from 'react'
import { JellifyDownload } from '../../types/JellifyDownload'
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { mapDtoToTrack } from '../../helpers/mappings'
import { deleteAudio, getAudioCache, saveAudio } from './offlineModeUtils'
import { QueryKeys } from '../../enums/query-keys'
import { networkStatusTypes } from './internetConnectionWatcher'
import DownloadProgress from '../../types/DownloadProgress'

interface NetworkContext {
	useDownload: UseMutationResult<void, Error, BaseItemDto, unknown>
	useRemoveDownload: UseMutationResult<void, Error, BaseItemDto, unknown>
	downloadedTracks: JellifyDownload[] | undefined
	activeDownloads: DownloadProgress[] | undefined
	networkStatus: keyof typeof networkStatusTypes | null
	setNetworkStatus: (status: keyof typeof networkStatusTypes | null) => void
}

const NetworkContextInitializer = () => {
	const queryClient = useQueryClient()
	const [networkStatus, setNetworkStatus] = useState<keyof typeof networkStatusTypes | null>(null)

	const useDownload = useMutation({
		mutationFn: (trackItem: BaseItemDto) => {
			const track = mapDtoToTrack(trackItem, [])

			return saveAudio(track, queryClient, false)
		},
		onSuccess: (data, variables) => {
			console.debug(`Downloaded ${variables.Id} successfully`)

			refetchDownloadedTracks()
			return data
		},
	})

	const useRemoveDownload = useMutation({
		mutationFn: (trackItem: BaseItemDto) => deleteAudio(trackItem),
		onSuccess: (data, { Id }) => {
			console.debug(`Removed ${Id} from storage`)

			refetchDownloadedTracks()
		},
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
		setNetworkStatus,
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
	networkStatus: null,
	setNetworkStatus: () => {},
})

export const NetworkContextProvider: ({
	children,
}: {
	children: ReactNode
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
	const {
		useDownload,
		useRemoveDownload,
		downloadedTracks,
		activeDownloads,
		networkStatus,
		setNetworkStatus,
	} = NetworkContextInitializer()

	return (
		<NetworkContext.Provider
			value={{
				useDownload,
				useRemoveDownload,
				activeDownloads,
				downloadedTracks,
				networkStatus,
				setNetworkStatus,
			}}
		>
			{children}
		</NetworkContext.Provider>
	)
}

export const useNetworkContext = () => useContext(NetworkContext)
