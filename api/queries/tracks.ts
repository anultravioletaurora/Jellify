import { QueryKeys } from "../../enums/query-keys";
import { ItemSortBy } from "@jellyfin/sdk/lib/generated-client/models/item-sort-by";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { useQuery } from "@tanstack/react-query";
import { QueryConfig } from "./query.config";
import Client from "../client";

export const useItemTracks = (itemId: string, sort: boolean = false) => useQuery({
    queryKey: [QueryKeys.ItemTracks, itemId, sort],
    queryFn: () => {

        console.debug(`Fetching item tracks ${sort ? "sorted" : "unsorted"}`)

        let sortBy: ItemSortBy[] = [];

        if (sort) {
            sortBy = [
                ItemSortBy.ParentIndexNumber,
                ItemSortBy.IndexNumber,
                ItemSortBy.SortName
            ]
        }

        return getItemsApi(Client.api!).getItems({
            parentId: itemId,
            sortBy
        })
        .then((response) => {
            return response.data.Items ? response.data.Items! : [];
        })
    },
})