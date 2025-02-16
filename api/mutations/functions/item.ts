import Client from "../../../api/client";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";

/**
 * Manually marks an item as played.
 * This should only be used for non-tracks,
 * as those playbacks will be handled by the server
 * 
 * This is mainly used for marking playlists
 * and albums as played, so we can use Jellyfin
 * to fetch recent ones later on
 * 
 * @param item The item to mark as played
 */
export async function markItemPlayed(item: BaseItemDto) : Promise<void> {
    return new Promise((resolve, reject) => {
        getPlaystateApi(Client.api!)
            .markPlayedItem({
                itemId: item.Id!,
                userId: Client.user!.id
            })
            .then((response) => {
                resolve()
            })
            .catch(error => {
                reject(error);
            })
    })
}