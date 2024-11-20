import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import { buildApiClient } from "../../client";
import _ from "lodash";

interface ServerMutationParams {
    serverUrl: string,
}

export const serverMutation = async (serverUrl: string) => {
    
    console.log("Mutating server URL");

    if (!!!serverUrl)
        throw Error("Server URL is empty")

    const api = await buildApiClient(serverUrl);

    if (!!!api)
        throw Error("Unable to build API client for server URL")

    console.log(`Created API client for ${api.basePath}`)
    return await getSystemApi(api).getPublicSystemInfo();
}