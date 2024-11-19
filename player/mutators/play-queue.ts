/**
 * Represents the organized play queue of the current selection,
 */

import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MMKVStorageKeys } from "../../enums/mmkv-storage-keys";
import { JellifyTrack } from "../../types/JellifyTrack";
import { add, getQueue, remove, removeUpcomingTracks } from "react-native-track-player/lib/src/trackPlayer";
import { fetchPlayQueue, storePlayQueue } from "./helpers/storage";
import { findPlayNextIndexStart, findPlayQueueIndexStart } from "./helpers";

/**
 * 
 */
export const addToPlayNext = useMutation({
    mutationFn: async (tracks: JellifyTrack[]) => {

        let playQueue = await fetchPlayQueue();
        let insertIndex = findPlayNextIndexStart(playQueue);

        add(tracks, insertIndex);

        tracks.forEach(track => {
            playQueue.splice(insertIndex, 0, track);
        });

        await storePlayQueue(playQueue)
    }
});

/**
 * Adds additional tracks to the end of the user queue
 */
export const addToPlayQueue = useMutation({
    mutationFn: async (tracks: JellifyTrack[]) => {

        let playQueue = await fetchPlayQueue();
        let insertIndex = findPlayQueueIndexStart(playQueue);

        add(tracks, insertIndex);

        tracks.forEach(track => {
            playQueue.splice(insertIndex, 0, track);
        });

        await storePlayQueue(playQueue)
    }
});

export const removeFromPlayQueue = useMutation({
    mutationFn: async (indexes: number[]) => {
        // Remove from the player first thing
        remove(indexes);
        let cachedQueue = await AsyncStorage.getItem(MMKVStorageKeys.PlayQueue);

        if (cachedQueue === null) {
            // Warn, not a showstopper as we'll just cache it at the end of this, this should hopefully never happen
            console.warn("Queue cache was null, setting...");

            storePlayQueue((await getQueue()) as JellifyTrack[]);
        } else {
            let queue : Array<JellifyTrack> = JSON.parse(cachedQueue);
            indexes.forEach(index => {
                queue.splice(index, 1); // Returns deleted queue items
            })
            storePlayQueue(queue);
        }
    },
    onError: () => {

    },
    onMutate: () => {

    },
    onSuccess: () => {

    }
});

export const clearPlayQueue = useMutation({
    mutationFn: async () => {
        removeUpcomingTracks()
        await storePlayQueue([]);
    }
})