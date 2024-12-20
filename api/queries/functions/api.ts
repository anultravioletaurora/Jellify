import { Api } from "@jellyfin/sdk";
import { fetchCredentials, fetchServer } from "./storage";
import { client } from "../../client";
import _ from "lodash";
import { QueryFunctionContext, QueryKey } from "@tanstack/react-query";

/**
 * A promise to build an authenticated Jellyfin API client
 * @returns A Promise of the authenticated Jellyfin API client or a rejection
 */
export function createApi(): Promise<Api> {
    return new Promise(async (resolve, reject) => {
        let credentials = await fetchCredentials();

        if (_.isUndefined(credentials)) {
            console.warn("No credentials exist for user, launching login flow");
            return reject("No credentials exist for the current user");
        }
                
        console.log("Signing into Jellyfin")
        return resolve(client.createApi(credentials!.server, credentials!.password));
    });
}

export function createPublicApi(): Promise<Api> {
    return new Promise(async (resolve) => {

        console.log("Fetching server details from storage")
        const server = await fetchServer()

        console.log(`Found stored server ${server.name}`)
        resolve(client.createApi(server.url));
    });
}