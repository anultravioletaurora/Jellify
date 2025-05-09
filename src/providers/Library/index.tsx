import { QueryKeys } from '../../enums/query-keys'
import { BaseItemDto, ItemSortBy, SortOrder } from '@jellyfin/sdk/lib/generated-client/models'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { useJellifyContext } from '..'
import { fetchArtists } from '../../api/queries/artist'
import { createContext, useContext, useState } from 'react'
import { useDisplayContext } from '../Display/display-provider'
import QueryConfig from '../../api/queries/query.config'
import { fetchTracks } from '../../api/queries/tracks'
import { fetchAlbums } from '../../api/queries/album'
import { useLibrarySortAndFilterContext } from './sorting-filtering'

interface LibraryContext {
	artists: InfiniteData<BaseItemDto[], unknown> | undefined
	albums: InfiniteData<BaseItemDto[], unknown> | undefined
	tracks: InfiniteData<BaseItemDto[], unknown> | undefined
	// genres: BaseItemDto[] | undefined
	// playlists: BaseItemDto[] | undefined

	refetchArtists: () => void
	refetchAlbums: () => void
	refetchTracks: () => void
	// refetchGenres: () => void
	// refetchPlaylists: () => void

	fetchNextArtistsPage: () => void
	hasNextArtistsPage: boolean

	fetchNextTracksPage: () => void
	hasNextTracksPage: boolean

	fetchNextAlbumsPage: () => void
	hasNextAlbumsPage: boolean

	isPendingArtists: boolean
	isPendingTracks: boolean
	isPendingAlbums: boolean
}

const LibraryContextInitializer = () => {
	const { api, user, library } = useJellifyContext()

	const { numberOfColumns } = useDisplayContext()

	const { sortDescending, isFavorites } = useLibrarySortAndFilterContext()

	const {
		data: artists,
		isPending: isPendingArtists,
		refetch: refetchArtists,
		fetchNextPage: fetchNextArtistsPage,
		hasNextPage: hasNextArtistsPage,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.AllArtists, isFavorites, sortDescending],
		queryFn: ({ pageParam }) =>
			fetchArtists(
				api,
				library,
				pageParam,
				isFavorites,
				[ItemSortBy.SortName],
				[sortDescending ? SortOrder.Descending : SortOrder.Ascending],
			),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			console.debug(`Artists last page length: ${lastPage.length}`)
			return lastPage.length === QueryConfig.limits.library ? lastPageParam + 1 : undefined
		},
	})

	const {
		data: tracks,
		isPending: isPendingTracks,
		refetch: refetchTracks,
		fetchNextPage: fetchNextTracksPage,
		hasNextPage: hasNextTracksPage,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.AllTracks, isFavorites, sortDescending],
		queryFn: ({ pageParam }) =>
			fetchTracks(
				api,
				library,
				pageParam,
				isFavorites,
				ItemSortBy.SortName,
				sortDescending ? SortOrder.Descending : SortOrder.Ascending,
			),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			console.debug(`Tracks last page length: ${lastPage.length}`)
			return lastPage.length === QueryConfig.limits.library * 2
				? lastPageParam + 1
				: undefined
		},
	})

	const {
		data: albums,
		isPending: isPendingAlbums,
		refetch: refetchAlbums,
		fetchNextPage: fetchNextAlbumsPage,
		hasNextPage: hasNextAlbumsPage,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.AllAlbums, isFavorites, sortDescending],
		queryFn: ({ pageParam }) =>
			fetchAlbums(
				api,
				library,
				pageParam,
				isFavorites,
				[ItemSortBy.SortName],
				[sortDescending ? SortOrder.Descending : SortOrder.Ascending],
			),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			console.debug(`Albums last page length: ${lastPage.length}`)
			return lastPage.length === QueryConfig.limits.library ? lastPageParam + 1 : undefined
		},
	})

	return {
		artists,
		refetchArtists,
		fetchNextArtistsPage,
		hasNextArtistsPage,
		tracks,
		refetchTracks,
		fetchNextTracksPage,
		hasNextTracksPage,
		albums,
		refetchAlbums,
		fetchNextAlbumsPage,
		hasNextAlbumsPage,
		isPendingArtists,
		isPendingTracks,
		isPendingAlbums,
	}
}

const LibraryContext = createContext<LibraryContext>({
	artists: undefined,
	refetchArtists: () => {},
	fetchNextArtistsPage: () => {},
	hasNextArtistsPage: false,
	tracks: undefined,
	refetchTracks: () => {},
	fetchNextTracksPage: () => {},
	hasNextTracksPage: false,
	albums: undefined,
	refetchAlbums: () => {},
	fetchNextAlbumsPage: () => {},
	hasNextAlbumsPage: false,
	isPendingArtists: false,
	isPendingTracks: false,
	isPendingAlbums: false,
})

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
	const context = LibraryContextInitializer()

	return <LibraryContext.Provider value={context}>{children}</LibraryContext.Provider>
}

export const useLibraryContext = () => useContext(LibraryContext)
