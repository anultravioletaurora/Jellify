import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../enums/query-keys";
import { buildApiClient } from "./client";

export const useApi = (serverUrl?: string, username?: string, password?: string, accessToken?: string) => useQuery({
    queryKey: [QueryKeys.Api, serverUrl, username, password, accessToken],
    queryFn: async ({ queryKey }) => buildApiClient(queryKey[1], queryKey[2], queryKey[3], queryKey[4])
})