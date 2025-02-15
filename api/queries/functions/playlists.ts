import Client from "../../client";
import { BaseItemDto, ItemSortBy, SortOrder } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";

export function fetchUserPlaylists(
    sortBy: ItemSortBy[] = []
): Promise<BaseItemDto[]> {
    console.debug(`Fetching user playlists ${sortBy.length > 0 ? "sorting by " + sortBy.toString() : ""}`);

    const defaultSorting : ItemSortBy[] = [
        ItemSortBy.IsFolder,
        ItemSortBy.SortName,
    ]

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItems({
                userId: Client.user!.id,
                parentId: Client.library!.playlistLibraryId!,
                fields: [
                    "Path"
                ],
                sortBy: sortBy.concat(defaultSorting),
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {
                if (response.data.Items)
                    resolve(response.data.Items.filter(playlist => 
                        playlist.Path?.includes("/config/data/playlists")
                    ))
                else 
                    resolve([]);
            })
            .catch((error) => {
                console.error(error);
                reject(error)
            })
    })
}

export function fetchPublicPlaylists(): Promise<BaseItemDto[]> {
    console.debug("Fetching public playlists");

    return new Promise(async (resolve, reject) => {
        getItemsApi(Client.api!)
            .getItems({
                parentId: Client.library!.playlistLibraryId!,
                sortBy: [
                    ItemSortBy.IsFolder,
                    ItemSortBy.SortName
                ],
                sortOrder: [
                    SortOrder.Ascending
                ]
            })
            .then((response) => {
                if (response.data.Items)
                    resolve(response.data.Items.filter(playlist => !playlist.Path?.includes("/config/data/playlists")))
                else 
                    resolve([]);
            })
            .catch((error) => {
                console.error(error);
                reject(error)
            })
    })
}