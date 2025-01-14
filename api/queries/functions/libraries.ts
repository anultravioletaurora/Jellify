import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { isUndefined } from "lodash";


export function fetchMusicLibraries(api: Api): Promise<BaseItemDto[]> {
    return new Promise(async (resolve, reject) => {
        console.debug("Fetching music libraries from Jellyfin");
        
        let libraries = await getItemsApi(api).getItems({ 
            includeItemTypes: ['CollectionFolder'] 
        });

        if (isUndefined(libraries.data.Items)) {
            console.warn("No libraries found on Jellyfin");
            return reject("No libraries found on Jellyfin");
        }

        let musicLibraries = libraries.data.Items!.filter(library => 
            library.CollectionType == 'music');
        
        return resolve(musicLibraries);
    });
}

export function fetchPlaylistLibrary(api: Api): Promise<BaseItemDto> {
    return new Promise(async (resolve, reject) => {
        console.debug("Fetching playlist library from Jellyfin");
        
        let libraries = await getItemsApi(api).getItems({ 
            includeItemTypes: ['ManualPlaylistsFolder'], 
            excludeItemTypes: ['CollectionFolder'] 
        });

        if (isUndefined(libraries.data.Items)) {
            console.warn("No playlist libraries found on Jellyfin");
            return reject("No playlist libraries found on Jellyfin");
        }

        console.debug("Playlist libraries", libraries.data.Items!)

        let playlistLibrary = libraries.data.Items!.filter(library => 
            library.CollectionType == 'playlists'
        )[0];

        if (isUndefined(playlistLibrary)) {
            console.warn("Playlist libary does not exist on server");
            return reject("Playlist library does not exist on server");
        }
        
        return resolve(playlistLibrary);
    })
}