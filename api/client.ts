import { Api, Jellyfin } from "@jellyfin/sdk";
import { getDeviceNameSync, getUniqueIdSync } from "react-native-device-info";
import { name, version } from "../package.json"
import _ from "lodash";

export const client : Jellyfin  = new Jellyfin({
    clientInfo: {
        name: name,
        version: version
    },
    deviceInfo: {
        name: getDeviceNameSync(),
        id: getUniqueIdSync()
    }
});

export function buildPublicApiClient (serverUrl : string): Api {
    let jellyfin = new Jellyfin(client);
    return jellyfin.createApi(serverUrl);
} 

export async function buildApiClient(serverUrl? : string, username? : string, password? : string, accessToken?: string) : Promise<Api | undefined> {
    let jellyfin = new Jellyfin(client);

    let api : Api;

    if (!!!serverUrl) {
        api = jellyfin.createApi(serverUrl!);

        if (!!!username && (!!!password || !!!accessToken)) {
            
            if (!!!accessToken) {
                return jellyfin.createApi(serverUrl!, accessToken!)
            }

            else {
                return jellyfin.createApi(serverUrl!)
                        .authenticateUserByName(username!, password!)
                        .then((response) => {
                            if (!_.isEmpty(response.data.AccessToken))
                                return jellyfin.createApi(serverUrl!, response.data.AccessToken!)
                            
                            return undefined;
                        })

            }

        }

        return api;
    }

    return undefined;
}