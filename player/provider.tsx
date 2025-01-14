import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { JellifyTrack } from "../types/JellifyTrack";
import { storage } from "../constants/storage";
import { MMKVStorageKeys } from "../enums/mmkv-storage-keys";
import { findPlayQueueIndexStart } from "./helpers/index";
import TrackPlayer, { Event, Progress, State, usePlaybackState, useProgress, useTrackPlayerEvents } from "react-native-track-player";
import _ from "lodash";
import { buildNewQueue } from "./helpers/queue";
import { useApiClientContext } from "../components/jellyfin-api-provider";
import { getPlaystateApi } from "@jellyfin/sdk/lib/utils/api";
import { handlePlaybackProgressUpdated, handlePlaybackStarted, handlePlaybackState, handlePlaybackStopped } from "./handlers";
import { useSetupPlayer } from "@/player/hooks";
import { UPDATE_INTERVAL } from "./config";
import { sleep } from "@/helpers/sleep";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { QueueMutation } from "./interfaces";
import { mapDtoToTrack } from "@/helpers/mappings";
import { QueuingType } from "@/enums/queuing-type";
import { trigger } from "react-native-haptic-feedback";
import { pause } from "react-native-track-player/lib/src/trackPlayer";

interface PlayerContext {
    showPlayer: boolean;
    setShowPlayer: React.Dispatch<SetStateAction<boolean>>;
    showMiniplayer: boolean;
    setShowMiniplayer: React.Dispatch<SetStateAction<boolean>>;
    nowPlaying: JellifyTrack | undefined;
    queue: JellifyTrack[];
    useTogglePlayback: UseMutationResult<void, Error, number | undefined, unknown>;
    playNewQueue: UseMutationResult<void, Error, QueueMutation, unknown>;
    playbackState: State | undefined;
    progress: Progress | undefined;
}

const PlayerContextInitializer = () => {

    const queueJson = storage.getString(MMKVStorageKeys.PlayQueue);

    const { apiClient, sessionId } = useApiClientContext();
    const playStateApi = getPlaystateApi(apiClient!)
    
    //#region State
    const [showPlayer, setShowPlayer] = useState<boolean>(false);
    const [showMiniplayer, setShowMiniplayer] = useState<boolean>(false);

    const [nowPlaying, setNowPlaying] = useState<JellifyTrack | undefined>(undefined);
    const [queue, setQueue] = useState<JellifyTrack[]>(queueJson ? JSON.parse(queueJson) : []);
    //#endregion State

    
    //#region Functions
    const play = async (index?: number | undefined) => {

        if (index)
            TrackPlayer.skip(index)

        TrackPlayer.play();
    }
    
    const resetQueue = async (hideMiniplayer?: boolean | undefined) => {
        console.debug("Clearing queue")
        await TrackPlayer.reset();
        setQueue([]);
        
        setShowMiniplayer(!hideMiniplayer)
    }
    
    const addToQueue = async (tracks: JellifyTrack[]) => {
        let insertIndex = findPlayQueueIndexStart(queue);
        console.debug(`Adding ${tracks.length} to queue at index ${insertIndex}`)
        
        await TrackPlayer.add(tracks, insertIndex);
        
        setQueue(buildNewQueue(queue, tracks, insertIndex))
        
        setShowMiniplayer(true);
    }
    //#endregion Functions
    
    //#region Hooks
    const useTogglePlayback = useMutation({
        mutationFn: async (index?: number | undefined) => {
            trigger("impactLight");
            if (playbackState === State.Playing)
                await pause();
            else 
                await play(index);
        }
    })

    const playNewQueue = useMutation({
        mutationFn: async (mutation: QueueMutation) => {
            trigger("impactLight");
            await resetQueue(false)
            await addToQueue(mutation.tracklist.map((track) => {
                return mapDtoToTrack(apiClient!, sessionId, track, QueuingType.FromSelection)
            }));
            
            await play(mutation.index);
        }
    });

    //#endregion

    //#region RNTP Setup
    const isPlayerReady = useSetupPlayer().isSuccess;

    useTrackPlayerEvents([
        Event.PlaybackProgressUpdated,
        Event.PlaybackState,
        Event.PlaybackActiveTrackChanged,
    ], async (event) => {
        switch (event.type) {

            case (Event.PlaybackState) : {
                handlePlaybackState(sessionId, playStateApi, await TrackPlayer.getActiveTrack() as JellifyTrack, event.state);
                break;
            }
            case (Event.PlaybackProgressUpdated) : {
                handlePlaybackProgressUpdated(sessionId, playStateApi, nowPlaying!, event);
                break;
            }

            case (Event.PlaybackActiveTrackChanged) : {

                console.debug("Active track changed");

                if ((await TrackPlayer.getActiveTrack() as JellifyTrack | undefined) !== nowPlaying) {    
                    // Sleep to prevent flickering in players when skipping to a queue index
                    sleep(250).then(async () => {
                        setNowPlaying(await TrackPlayer.getActiveTrack() as JellifyTrack | undefined);
                    });
                }
            }
        }
    })

    const { state: playbackState } = usePlaybackState();
    const progress = useProgress(UPDATE_INTERVAL);

    useEffect(() => {
        if (!showMiniplayer)
            setNowPlaying(undefined);
    }, [
        showMiniplayer
    ])

    useEffect(() => {
        if (isPlayerReady)
          console.debug("Player is ready")
        else
          console.warn("Player could not be setup")
      }, [
        isPlayerReady
      ])
    //#endregion RNTP Setup

    //#region return
    return {
        showPlayer,
        setShowPlayer,
        showMiniplayer,
        setShowMiniplayer,
        nowPlaying,
        queue,
        useTogglePlayback,
        playNewQueue,
        playbackState,
        progress,
    }
    //#endregion return
}

//#region Create PlayerContext
export const PlayerContext = createContext<PlayerContext>({
    showPlayer: false,
    setShowPlayer: () => {},
    showMiniplayer: false,
    setShowMiniplayer: () => {},
    nowPlaying: undefined,
    queue: [],
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
    playNewQueue: {
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
        showPlayer, 
        setShowPlayer, 
        showMiniplayer, 
        setShowMiniplayer, 
        nowPlaying,
        queue, 
        useTogglePlayback,
        playNewQueue,
        playbackState,
        progress
    } = PlayerContextInitializer();

    return <PlayerContext.Provider value={{
        showPlayer,
        setShowPlayer,
        showMiniplayer,
        setShowMiniplayer,
        nowPlaying,
        queue,
        useTogglePlayback,
        playNewQueue,
        playbackState,
        progress
    }}>
        { children }
    </PlayerContext.Provider>
}

export const usePlayerContext = () => useContext(PlayerContext);