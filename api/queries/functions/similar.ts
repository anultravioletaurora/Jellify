import Client from "@/api/client";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi, getLibraryApi } from "@jellyfin/sdk/lib/utils/api";

export default function fetchSimilarArtists(artistId : string) : Promise<BaseItemDto[]> {
    return new Promise((resolve, reject) => {

        if (!Client.api || !Client.user)
            reject("Client has not been set")

        else 
            getLibraryApi(Client.api)
                .getSimilarArtists({
                    userId: Client.user.id,
                    itemId: artistId
                })
                .then(({ data }) => {
                    resolve(data.Items ?? [])
                })
                .catch((error) => {
                    reject(error)
                })
    })
}