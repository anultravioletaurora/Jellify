import fetchSimilar from '../../api/queries/similar'
import Client from '../../api/client'
import { QueryKeys } from '../../enums/query-keys'
import {
	BaseItemDto,
	BaseItemKind,
	ItemSortBy,
	SortOrder,
} from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { useQuery } from '@tanstack/react-query'
import { createContext, ReactNode, SetStateAction, useContext, useState } from 'react'
import { SharedValue, useSharedValue } from 'react-native-reanimated'

interface ArtistContext {
	fetchingAlbums: boolean
	fetchingSimilarArtists: boolean
	refresh: () => void
	albums: BaseItemDto[] | undefined
	similarArtists: BaseItemDto[] | undefined
	artist: BaseItemDto
	setScroll: React.Dispatch<SetStateAction<number>>
	scroll: SharedValue<number>
}

const ArtistContextInitializer = (artist: BaseItemDto) => {
	const {
		data: albums,
		refetch: refetchAlbums,
		isPending: fetchingAlbums,
	} = useQuery({
		queryKey: [QueryKeys.ArtistAlbums, artist.Id!],
		queryFn: ({ queryKey }) => {
			return getItemsApi(Client.api!)
				.getItems({
					includeItemTypes: [BaseItemKind.MusicAlbum],
					recursive: true,
					excludeItemIds: [queryKey[1] as string],
					sortBy: [
						ItemSortBy.PremiereDate,
						ItemSortBy.ProductionYear,
						ItemSortBy.SortName,
					],
					sortOrder: [SortOrder.Descending],
					artistIds: [queryKey[1] as string],
				})
				.then((response) => {
					return response.data.Items ? response.data.Items! : []
				})
		},
	})

	const {
		data: similarArtists,
		refetch: refetchRefetchSimilarArtists,
		isPending: fetchingSimilarArtists,
	} = useQuery({
		queryKey: [QueryKeys.SimilarItems, artist.Id],
		queryFn: () => fetchSimilar(artist.Id!),
	})

	const refresh = () => {
		refetchAlbums()
		refetchRefetchSimilarArtists()
	}

	const [_, setScroll] = useState<number>(0)
	const scroll = useSharedValue(0)
	return {
		artist,
		albums,
		similarArtists,
		fetchingAlbums,
		fetchingSimilarArtists,
		refresh,
		scroll,
		setScroll,
	}
}

const ArtistContext = createContext<ArtistContext>({
	fetchingAlbums: false,
	fetchingSimilarArtists: false,
	artist: {},
	albums: [],
	similarArtists: [],
	refresh: () => {},
	scroll: { value: 0 } as SharedValue<number>,
	setScroll: () => {},
})

export const ArtistProvider: ({
	artist,
	children,
}: {
	artist: BaseItemDto
	children: ReactNode
}) => React.JSX.Element = ({ artist, children }) => {
	const context = ArtistContextInitializer(artist)

	return <ArtistContext.Provider value={{ ...context }}>{children}</ArtistContext.Provider>
}

export const useArtistContext = () => useContext(ArtistContext)
