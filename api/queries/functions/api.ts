import { Api } from "@jellyfin/sdk";
import { JellyfinInfo } from "../../info";
import _ from "lodash";

export function createApi(serverUrl?: string, username?: string, password?: string, accessToken?: string): Promise<Api> {
    return new Promise((resolve, reject) => {

        if (_.isUndefined(serverUrl)) {
            console.info("Server Url doesn't exist yet")
            return reject("Server Url doesn't exist");
        }

        if (!_.isUndefined(accessToken)) {
            console.info("Creating API with accessToken")
            return resolve(JellyfinInfo.createApi(serverUrl, accessToken));
        }
                

        if (_.isUndefined(username) && _.isUndefined(password)) {

            console.info("Creating public API for server url")
            return resolve(JellyfinInfo.createApi(serverUrl));
        }
        
        JellyfinInfo.createApi(serverUrl).authenticateUserByName(username!, password)
            .then(({ data }) => {
                if (data.AccessToken)
                    return resolve(JellyfinInfo.createApi(serverUrl, data.AccessToken));

                else
                    return reject("Unable to sign in");
            });
    });
}