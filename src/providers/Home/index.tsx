import React, { createContext, ReactNode, useContext, useState } from 'react'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { InfiniteData, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../enums/query-keys'
import { fetchRecentlyPlayed, fetchRecentlyPlayedArtists } from '../../api/queries/recents'
import { queryClient } from '../../constants/query-client'
import QueryConfig from '../../api/queries/query.config'
import { fetchFrequentlyPlayed, fetchFrequentlyPlayedArtists } from '../../api/queries/frequents'
import { useJellifyContext } from '..'
interface HomeContext {
	refreshing: boolean
	onRefresh: () => void
	recentArtists: InfiniteData<BaseItemDto[], unknown> | undefined
	recentTracks: InfiniteData<BaseItemDto[], unknown> | undefined

	fetchNextRecentTracks: () => void
	hasNextRecentTracks: boolean

	fetchNextRecentArtists: () => void
	hasNextRecentArtists: boolean

	fetchNextFrequentArtists: () => void
	hasNextFrequentArtists: boolean

	fetchNextFrequentlyPlayed: () => void
	hasNextFrequentlyPlayed: boolean

	frequentArtists: InfiniteData<BaseItemDto[], unknown> | undefined
	frequentlyPlayed: InfiniteData<BaseItemDto[], unknown> | undefined
}

const HomeContextInitializer = () => {
	const { api, library, user } = useJellifyContext()
	const [refreshing, setRefreshing] = useState<boolean>(false)

	const {
		data: recentTracks,
		refetch: refetchRecentTracks,
		fetchNextPage: fetchNextRecentTracks,
		hasNextPage: hasNextRecentTracks,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.RecentlyPlayed],
		queryFn: () => fetchRecentlyPlayed(api, library),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			return lastPage.length === QueryConfig.limits.recents * 4
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
		},
	})
	const {
		data: recentArtists,
		refetch: refetchRecentArtists,
		fetchNextPage: fetchNextRecentArtists,
		hasNextPage: hasNextRecentArtists,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.RecentlyPlayedArtists],
		queryFn: () => fetchRecentlyPlayedArtists(api, library),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			return lastPage.length === QueryConfig.limits.recents * 4
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
		},
	})

	const {
		data: frequentlyPlayed,
		refetch: refetchFrequentlyPlayed,
		fetchNextPage: fetchNextFrequentlyPlayed,
		hasNextPage: hasNextFrequentlyPlayed,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.FrequentlyPlayed],
		queryFn: () => fetchFrequentlyPlayed(api, library),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			return lastPage.length === QueryConfig.limits.recents * 4
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
		},
	})

	const {
		data: frequentArtists,
		refetch: refetchFrequentArtists,
		fetchNextPage: fetchNextFrequentArtists,
		hasNextPage: hasNextFrequentArtists,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.FrequentArtists],
		queryFn: () => fetchFrequentlyPlayedArtists(api, library),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			return lastPage.length === QueryConfig.limits.recents * 4
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
		},
	})

	const onRefresh = async () => {
		setRefreshing(true)

		queryClient.invalidateQueries({
			queryKey: [
				QueryKeys.RecentlyPlayedArtists,
				QueryConfig.limits.recents * 4,
				QueryConfig.limits.recents,
			],
		})

		queryClient.invalidateQueries({
			queryKey: [
				QueryKeys.RecentlyPlayed,
				QueryConfig.limits.recents * 4,
				QueryConfig.limits.recents,
			],
		})

		await Promise.all([
			refetchRecentTracks(),
			refetchRecentArtists(),
			refetchFrequentArtists(),
			refetchFrequentlyPlayed(),
		])

		setRefreshing(false)
	}

	return {
		refreshing,
		onRefresh,
		recentArtists,
		recentTracks,
		frequentArtists,
		frequentlyPlayed,
		fetchNextRecentTracks,
		hasNextRecentTracks,
		fetchNextRecentArtists,
		hasNextRecentArtists,
		fetchNextFrequentArtists,
		hasNextFrequentArtists,
		fetchNextFrequentlyPlayed,
		hasNextFrequentlyPlayed,
	}
}

const HomeContext = createContext<HomeContext>({
	refreshing: false,
	onRefresh: () => {},
	recentArtists: undefined,
	recentTracks: undefined,
	frequentArtists: undefined,
	frequentlyPlayed: undefined,
	fetchNextRecentTracks: () => {},
	hasNextRecentTracks: false,
	fetchNextFrequentArtists: () => {},
	hasNextFrequentArtists: false,
	fetchNextFrequentlyPlayed: () => {},
	hasNextFrequentlyPlayed: false,
	fetchNextRecentArtists: () => {},
	hasNextRecentArtists: false,
})

export const HomeProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const context = HomeContextInitializer()

	return <HomeContext.Provider value={context}>{children}</HomeContext.Provider>
}

export const useHomeContext = () => useContext(HomeContext)
