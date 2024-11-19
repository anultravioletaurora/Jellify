import { useQuery, UseQueryResult } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKVStorageKeys } from "../../enums/mmkv-storage-keys";

import { JellifyTrack } from "../../types/JellifyTrack";
import { QueryKeys } from "../../enums/query-keys";

export const useStoredQueue: UseQueryResult<JellifyTrack[]> = useQuery({
    queryKey: [QueryKeys.PlayQueue],
    queryFn: (() => {
        return AsyncStorage.getItem(MMKVStorageKeys.PlayQueue);
    })
});