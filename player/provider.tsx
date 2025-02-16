import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { JellifyTrack } from "../types/JellifyTrack";
import { storage } from "../constants/storage";
import { MMKVStorageKeys } from "../enums/mmkv-storage-keys";
import { findPlayNextIndexStart, findPlayQueueIndexStart } from "./helpers/index";
import TrackPlayer, { Event, IOSCategory, IOSCategoryOptions, Progress, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import { isEqual, isUndefined } from "lodash";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { handlePlaybackProgressUpdated, handlePlaybackState } from "./handlers";
import { useUpdateOptions } from "../player/hooks";
import { UPDATE_INTERVAL } from "./config";
import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import { mapDtoToTrack } from "../helpers/mappings";
import { QueuingType } from "../enums/queuing-type";
import { trigger } from "react-native-haptic-feedback";
import { getQueue, pause, seekTo, skip, skipToNext, skipToPrevious } from "react-native-track-player/lib/src/trackPlayer";
import { convertRunTimeTicksToSeconds } from "../helpers/runtimeticks";
import Client from "../api/client";
import { AddToQueueMutation, QueueMutation, QueueOrderMutation } from "./interfaces";
import { Section } from "../components/Player/types";
import { Queue } from "./types/queue-item";
import { markItemPlayed } from "../api/mutations/functions/item";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { QueryKeys } from "../enums/query-keys";
import { CAPABILITIES } from "./constants";

interface PlayerContext {
    initialized: boolean;
    nowPlayingIsFavorite: boolean;
    setNowPlayingIsFavorite: React.Dispatch<SetStateAction<boolean>>;
    nowPlaying: JellifyTrack | undefined;
    playQueue: JellifyTrack[];
    queue: Queue;
    getQueueSectionData: () => Section[];
    useAddToQueue: UseMutationResult<void, Error, AddToQueueMutation, unknown>;
    useClearQueue: UseMutationResult<void, Error, void, unknown>;
    useRemoveFromQueue: UseMutationResult<void, Error, number, unknown>;
    useReorderQueue: UseMutationResult<void, Error, QueueOrderMutation, unknown>;
    useTogglePlayback: UseMutationResult<void, Error, number | undefined, unknown>;
    useSeekTo: UseMutationResult<void, Error, number, unknown>;
    useSkip: UseMutationResult<void, Error, number | undefined, unknown>;
    usePrevious: UseMutationResult<void, Error, void, unknown>;
    usePlayNewQueue: UseMutationResult<void, Error, QueueMutation, unknown>;
    playbackState: State | undefined;
    progress: Progress | undefined;
}

const PlayerContextInitializer = () => {

    const nowPlayingJson = storage.getString(MMKVStorageKeys.NowPlaying)
    const playQueueJson = storage.getString(MMKVStorageKeys.PlayQueue);
    const queueJson = storage.getString(MMKVStorageKeys.Queue)

    const playStateApi = getPlaystateApi(Client.api!)
    
    //#region State
    const [initialized, setInitialized] = useState<boolean>(false);

    const [nowPlayingIsFavorite, setNowPlayingIsFavorite] = useState<boolean>(false);
    const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(nowPlayingJson ? JSON.parse(nowPlayingJson) : undefined);
    const [isSkipping, setIsSkipping] = useState<boolean>(false);

    const [playQueue, setPlayQueue] = useState<JellifyTrack[]>(playQueueJson ? JSON.parse(playQueueJson) : []);
    
    const [queue, setQueue] = useState<Queue>(queueJson ? JSON.parse(queueJson) : 'Queue');
    //#endregion State

    
    //#region Functions
    const play = async (index?: number | undefined) => {

        if (index && index > 0) {
            TrackPlayer.skip(index);
        }

        TrackPlayer.play();
    }

    const getQueueSectionData : () => Section[] = () => {
        return Object.keys(QueuingType).map((type) => {
            return {
                title: type,
                data: playQueue.filter(track => track.QueuingType === type)
            } as Section
        });
    }
    
    const resetQueue = async (hideMiniplayer?: boolean | undefined) => {
        console.debug("Clearing queue")
        await TrackPlayer.reset();
        setPlayQueue([]);        
    }
    
    const addToQueue = async (tracks: JellifyTrack[]) => {
        const insertIndex = await findPlayQueueIndexStart(playQueue);
        console.debug(`Adding ${tracks.length} to queue at index ${insertIndex}`)
        
        await TrackPlayer.add(tracks, insertIndex);
        
        setPlayQueue(await getQueue() as JellifyTrack[])
    }

    const addToNext = async (tracks: JellifyTrack[]) => {
        const insertIndex = await findPlayNextIndexStart(playQueue);

        console.debug(`Adding ${tracks.length} to queue at index ${insertIndex}`);

        await TrackPlayer.add(tracks, insertIndex);

        setPlayQueue(await getQueue() as JellifyTrack[]);
    }
    //#endregion Functions
    
    //#region Hooks
    const useAddToQueue = useMutation({
        mutationFn: async (mutation: AddToQueueMutation) => {
            trigger("effectDoubleClick");

            if (mutation.queuingType === QueuingType.PlayingNext)
                return addToNext([mapDtoToTrack(mutation.track, mutation.queuingType)]);

            else
                return addToQueue([mapDtoToTrack(mutation.track, mutation.queuingType)])
        }
    });

    const useRemoveFromQueue = useMutation({
        mutationFn: async (index: number) => {
            trigger("impactMedium");

            await TrackPlayer.remove([index]);

            setPlayQueue(await TrackPlayer.getQueue() as JellifyTrack[])
        }
    })

    const useClearQueue = useMutation({
        mutationFn: async () => {
            trigger("effectDoubleClick")

            await TrackPlayer.removeUpcomingTracks();

            setPlayQueue(await getQueue() as JellifyTrack[]);
        }
    });

    const useReorderQueue = useMutation({
        mutationFn: async (mutation : QueueOrderMutation) => {
            setPlayQueue(mutation.newOrder);
            await TrackPlayer.move(mutation.from, mutation.to);
        }
    })

    const useTogglePlayback = useMutation({
        mutationFn: (index?: number | undefined) => {
            trigger("impactMedium");
            if (playbackState === State.Playing)
                return pause();
            else 
                return play(index);
        }
    });

    const useSeekTo = useMutation({
        mutationFn: async (position: number) => {
            trigger('impactLight');
            await seekTo(position);

            handlePlaybackProgressUpdated(Client.sessionId, playStateApi, nowPlaying!, { 
                buffered: 0, 
                position, 
                duration: convertRunTimeTicksToSeconds(nowPlaying!.duration!) 
            });
        }
    });

    const useSkip = useMutation({
        mutationFn: async (index?: number | undefined) => {
            trigger("impactMedium")
            if (!isUndefined(index)) {
                setIsSkipping(true);
                setNowPlaying(playQueue[index]);
                await skip(index);
                setIsSkipping(false);
            }
            else {
                const nowPlayingIndex = playQueue.findIndex((track) => track.item.Id === nowPlaying!.item.Id);
                setNowPlaying(playQueue[nowPlayingIndex + 1])
                await skipToNext();
            }
        }
    });

    const usePrevious = useMutation({
        mutationFn: async () => {
            trigger("impactMedium");

            const nowPlayingIndex = playQueue.findIndex((track) => track.item.Id === nowPlaying!.item.Id);

            if (nowPlayingIndex > 0) {
                setNowPlaying(playQueue[nowPlayingIndex - 1])
                await skipToPrevious();
            }
        }
    })

    const usePlayNewQueue = useMutation({
        mutationFn: async (mutation: QueueMutation) => {
            trigger("effectDoubleClick");

            setIsSkipping(true);

            // Optimistically set now playing
            setNowPlaying(mapDtoToTrack(mutation.tracklist[mutation.index ?? 0], QueuingType.FromSelection));

            await resetQueue(false);
            await addToQueue(mutation.tracklist.map((track) => {
                return mapDtoToTrack(track, QueuingType.FromSelection)
            }));
            
            setQueue(mutation.queue);
        },
        onSuccess: async (data, mutation: QueueMutation) => {
            setIsSkipping(false);
            await play(mutation.index)
        },
        onError: async () => {
            setIsSkipping(false);
            setNowPlaying(await TrackPlayer.getActiveTrack() as JellifyTrack)
        }
    });

    //#endregion

    //#region RNTP Setup
    
    const { state: playbackState } = usePlaybackState();
    const progress = useProgress(UPDATE_INTERVAL);

    useTrackPlayerEvents([
        Event.RemoteLike,
        Event.RemoteDislike,
        Event.PlaybackProgressUpdated,
        Event.PlaybackState,
        Event.PlaybackActiveTrackChanged,
    ], async (event) => {
        switch (event.type) {

            case (Event.RemoteLike) : {

                setNowPlayingIsFavorite(true);
                break;
            }

            case (Event.RemoteDislike) : {

                setNowPlayingIsFavorite(false);
                break;
            }

            case (Event.PlaybackState) : {
                handlePlaybackState(Client.sessionId, playStateApi, await TrackPlayer.getActiveTrack() as JellifyTrack, event.state, progress);
                break;
            }
            case (Event.PlaybackProgressUpdated) : {
                handlePlaybackProgressUpdated(Client.sessionId, playStateApi, nowPlaying!, event);
                break;
            }

            case (Event.PlaybackActiveTrackChanged) : {

                if (initialized && !isSkipping) {
                    const activeTrack = await TrackPlayer.getActiveTrack() as JellifyTrack | undefined;
                    if (activeTrack && !isEqual(activeTrack, nowPlaying)) {    
                        setNowPlaying(activeTrack);

                        // Set player favorite state to user data IsFavorite
                        // This is super nullish so we need to do a lot of 
                        // checks on the fields
                        // TODO: Turn this check into a helper function
                        setNowPlayingIsFavorite(
                            isUndefined(activeTrack) ? false 
                            : isUndefined(activeTrack!.item.UserData) ? false 
                            : activeTrack.item.UserData.IsFavorite ?? false
                        );

                        await useUpdateOptions(nowPlayingIsFavorite);

                    } else if (!!!activeTrack) {
                        setNowPlaying(undefined)
                        setNowPlayingIsFavorite(false);
                    } else {
                        // Do nothing
                    }
                }
            }
        }
    });

    //#endregion RNTP Setup

    //#region useEffects
    useEffect(() => {
        storage.set(MMKVStorageKeys.Queue, JSON.stringify(queue))
    }, [
        queue
    ])

    useEffect(() => {
        if (initialized && playQueue)
            storage.set(MMKVStorageKeys.PlayQueue, JSON.stringify(playQueue))
    }, [
        playQueue
    ])

    useEffect(() => {
        if (initialized && nowPlaying)
            storage.set(MMKVStorageKeys.NowPlaying, JSON.stringify(nowPlaying))
    }, [
        nowPlaying
    ])

    useEffect(() => {
        if (!initialized && playQueue.length > 0 && nowPlaying) {
            TrackPlayer.setQueue(playQueue)
                .then(() => {
                    TrackPlayer.skip(playQueue.findIndex(track => track.item.Id! === nowPlaying.item.Id!));
                });
        }

        setInitialized(true);
    }, [
        playQueue,
        nowPlaying
    ])
    //#endregion useEffects

    //#region return
    return {
        initialized,
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying,
        playQueue,
        queue,
        getQueueSectionData,
        useAddToQueue,
        useClearQueue,
        useReorderQueue,
        useRemoveFromQueue,
        useTogglePlayback,
        useSeekTo,
        useSkip,
        usePrevious,
        usePlayNewQueue,
        playbackState,
        progress,
    }
    //#endregion return
}

//#region Create PlayerContext
export const PlayerContext = createContext<PlayerContext>({
    initialized: false,
    nowPlayingIsFavorite: false,
    setNowPlayingIsFavorite: () => {},
    nowPlaying: undefined,
    playQueue: [],
    queue: "Recently Played",
    getQueueSectionData: () => [],
    useAddToQueue: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    useClearQueue: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    useRemoveFromQueue: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    useReorderQueue: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    useTogglePlayback: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    useSeekTo: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    useSkip: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    usePrevious: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    usePlayNewQueue: {
        mutate: () => {},
        mutateAsync: async () => {},
        data: undefined,
        error: null,
        variables: undefined,
        isError: false,
        isIdle: true,
        isPaused: false,
        isPending: false,
        isSuccess: false,
        status: "idle",
        reset: () => {},
        context: {},
        failureCount: 0,
        failureReason: null,
        submittedAt: 0
    },
    playbackState: undefined,
    progress: undefined,
});
//#endregion Create PlayerContext

export const PlayerProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
    const { 
        initialized,
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying,
        playQueue, 
        queue,
        getQueueSectionData,
        useAddToQueue,
        useClearQueue,
        useRemoveFromQueue,
        useReorderQueue,
        useTogglePlayback,
        useSeekTo,
        useSkip,
        usePrevious,
        usePlayNewQueue,
        playbackState,
        progress
    } = PlayerContextInitializer();

    return <PlayerContext.Provider value={{
        initialized,
        nowPlayingIsFavorite,
        setNowPlayingIsFavorite,
        nowPlaying,
        playQueue,
        queue,
        getQueueSectionData,
        useAddToQueue,
        useClearQueue,
        useRemoveFromQueue,
        useReorderQueue,
        useTogglePlayback,
        useSeekTo,
        useSkip,
        usePrevious,
        usePlayNewQueue,
        playbackState,
        progress
    }}>
        { children }
    </PlayerContext.Provider>
}

export const usePlayerContext = () => useContext(PlayerContext);