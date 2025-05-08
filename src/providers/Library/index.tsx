import { QueryKeys } from '../../enums/query-keys'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { useJellifyContext } from '..'
import { fetchArtists } from '../../api/queries/artist'
import { createContext, useContext } from 'react'
import { useDisplayContext } from '../../components/display-provider'
import QueryConfig from '../../api/queries/query.config'
import { fetchTracks } from '../../api/queries/tracks'
import { fetchAlbums } from '../../api/queries/album'

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
}

const LibraryContextInitializer = () => {
	const { api, user, library } = useJellifyContext()

	const { numberOfColumns } = useDisplayContext()

	const {
		data: artists,
		refetch: refetchArtists,
		fetchNextPage: fetchNextArtistsPage,
		hasNextPage: hasNextArtistsPage,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.AllArtists],
		queryFn: ({ pageParam }) => fetchArtists(api, library, numberOfColumns, pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			console.debug('Page params', lastPageParam, allPageParams)
			return lastPage.length === numberOfColumns * QueryConfig.limits.library
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
		},
	})

	const {
		data: tracks,
		refetch: refetchTracks,
		fetchNextPage: fetchNextTracksPage,
		hasNextPage: hasNextTracksPage,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.AllTracks],
		queryFn: ({ pageParam }) => fetchTracks(api, library, numberOfColumns, pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			console.debug('Page params', lastPageParam, allPageParams)
			return lastPage.length === numberOfColumns * QueryConfig.limits.library
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
		},
	})

	const {
		data: albums,
		refetch: refetchAlbums,
		fetchNextPage: fetchNextAlbumsPage,
		hasNextPage: hasNextAlbumsPage,
	} = useInfiniteQuery({
		queryKey: [QueryKeys.AllAlbums],
		queryFn: ({ pageParam }) => fetchAlbums(api, library, numberOfColumns, pageParam),
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
			console.debug('Page params', lastPageParam, allPageParams)
			return lastPage.length === numberOfColumns * QueryConfig.limits.library
				? lastPageParam + 1
				: lastPage.length >= 0
					? lastPageParam
					: undefined
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
})

export const LibraryProvider = ({ children }: { children: React.ReactNode }) => {
	const context = LibraryContextInitializer()

	return <LibraryContext.Provider value={context}>{children}</LibraryContext.Provider>
}

export const useLibraryContext = () => useContext(LibraryContext)
