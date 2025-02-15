import { useQuery } from "@tanstack/react-query"
import { QueryKeys } from "../../enums/query-keys"
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api"
import { BaseItemKind, ItemSortBy, SortOrder } from "@jellyfin/sdk/lib/generated-client/models"
import Client from "../client"



export const useArtistFeaturedOnAlbums = (artistId: string) => useQuery({
    queryKey: [QueryKeys.ArtistFeaturedAlbums, artistId],
    queryFn: ({ queryKey }) => {
        return getItemsApi(Client.api!).getItems({
            includeItemTypes: [BaseItemKind.MusicAlbum],
            recursive: true,
            excludeItemIds: [queryKey[1] as string],
            sortBy: [
                ItemSortBy.PremiereDate,
                ItemSortBy.ProductionYear,
                ItemSortBy.SortName
            ],
            sortOrder: [ SortOrder.Descending ],
            contributingArtistIds: [queryKey[1] as string]
        })
        .then((response) => {
            return response.data.Items ? response.data.Items! : [];
        })
    }
})