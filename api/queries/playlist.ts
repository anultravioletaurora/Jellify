import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { getPlaylistsApi } from "@jellyfin/sdk/lib/utils/api/playlists-api"
import { createApi } from "./functions/api";


export const usePlaylists = useQuery({
    queryKey: [QueryKeys.Playlists],
    queryFn: async () => {
        return getPlaylistsApi(await createApi())
    }
})