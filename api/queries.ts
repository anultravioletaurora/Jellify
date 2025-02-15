import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../enums/query-keys";
import { createApi } from "./queries/functions/api";

export const useApi = (serverUrl?: string, username?: string, password?: string, accessToken?: string) => useQuery({
    queryKey: [QueryKeys.Api, serverUrl, username, password, accessToken],
    queryFn: ({ queryKey }) => {

        const serverUrl : string | undefined = queryKey[1];
        const username : string | undefined = queryKey[2];
        const password : string | undefined = queryKey[3];
        const accessToken : string | undefined = queryKey[4];

        return createApi(serverUrl, username, password, accessToken)
    },
})