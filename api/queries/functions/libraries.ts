import Client from "../../client";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getUserViewsApi } from "@jellyfin/sdk/lib/utils/api";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { isUndefined } from "lodash";


export function fetchMusicLibraries(): Promise<BaseItemDto[]> {
    return new Promise(async (resolve, reject) => {
        console.debug("Fetching music libraries from Jellyfin");
        
        const libraries = await getItemsApi(Client.api!).getItems({ 
            includeItemTypes: ['CollectionFolder'] 
        });

        if (isUndefined(libraries.data.Items)) {
            console.warn("No libraries found on Jellyfin");
            return reject("No libraries found on Jellyfin");
        }

        const musicLibraries = libraries.data.Items!.filter(library => 
            library.CollectionType == 'music');
        
        return resolve(musicLibraries);
    });
}

export function fetchPlaylistLibrary(): Promise<BaseItemDto> {
    return new Promise(async (resolve, reject) => {
        console.debug("Fetching playlist library from Jellyfin");
        
        const libraries = await getItemsApi(Client.api!).getItems({ 
            includeItemTypes: ['ManualPlaylistsFolder'], 
            excludeItemTypes: ['CollectionFolder'] 
        });

        if (isUndefined(libraries.data.Items)) {
            console.warn("No playlist libraries found on Jellyfin");
            return reject("No playlist libraries found on Jellyfin");
        }

        console.debug("Playlist libraries", libraries.data.Items!)

        const playlistLibrary = libraries.data.Items!.filter(library => 
            library.CollectionType == 'playlists'
        )[0];

        if (isUndefined(playlistLibrary)) {
            console.warn("Playlist libary does not exist on server");
            return reject("Playlist library does not exist on server");
        }
        
        return resolve(playlistLibrary);
    })
}

export function fetchUserViews() : Promise<BaseItemDto[]> {
    return new Promise(async (resolve, reject) => {
        console.debug("Fetching user views")

        getUserViewsApi(Client.api!)
            .getUserViews({
                userId: Client.user!.id
            })
            .then((response) => {
                if (response.data.Items)
                    resolve(response.data.Items)

                else
                    resolve([])
            })
            .catch((error) => {
                reject(error)
            })
    });
}