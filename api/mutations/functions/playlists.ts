import Client from "@/api/client";
import { getPlaylistsApi } from "@jellyfin/sdk/lib/utils/api";



export async function reorderPlaylist(playlistId: string, itemId: string, to: number) {
    return getPlaylistsApi(Client.api!)
        .moveItem({
            playlistId, 
            itemId,
            newIndex: to
        });
}