import AsyncStorage from "@react-native-async-storage/async-storage";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { MMKVStorageKeys } from "../../enums/mmkv-storage-keys";
import { QueryKeys } from "../../enums/query-keys";
import { JellifyTrack } from "../../types/JellifyTrack";


export const useQueue: UseQueryResult<JellifyTrack[]> = useQuery({
    queryKey: [QueryKeys.PlayQueue],
    queryFn: (() => {
        return AsyncStorage.getItem(MMKVStorageKeys.PlayQueue);
    })
});
