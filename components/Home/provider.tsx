import React, { createContext, ReactNode, useContext, useState } from "react";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { fetchRecentlyPlayed, fetchRecentlyPlayedArtists } from "../../api/queries/functions/recents";

interface HomeContext {
    refreshing: boolean;
    onRefresh: () => void;
    recentArtists: BaseItemDto[] | undefined;
    recentTracks: BaseItemDto[] | undefined;
}

const HomeContextInitializer = () => {
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { data : recentTracks, refetch : refetchRecentTracks } = useQuery({
        queryKey: [QueryKeys.RecentlyPlayed],
        queryFn: () => fetchRecentlyPlayed()
    });
    const { data : recentArtists, refetch : refetchRecentArtists } = useQuery({
        queryKey: [QueryKeys.RecentlyPlayedArtists],
        queryFn: () => fetchRecentlyPlayedArtists()
    });

    const onRefresh = async () => {
        await Promise.all([
            refetchRecentTracks(),
            refetchRecentArtists()
        ])
        .then(() => {
            setRefreshing(false);
        })
    }

    return {
        refreshing,
        onRefresh,
        recentArtists,
        recentTracks,
    };
}

const HomeContext = createContext<HomeContext>({
    refreshing: false,
    onRefresh: () => {},
    recentArtists: undefined,
    recentTracks: undefined
});

export const HomeProvider: ({ children }: {
    children: ReactNode;
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {

    const {
        refreshing,
        onRefresh,
        recentTracks,
        recentArtists,
    } = HomeContextInitializer();

    return (
        <HomeContext.Provider value={{
            refreshing,
            onRefresh,
            recentTracks,
            recentArtists
        }}>
            { children }
        </HomeContext.Provider>
    )
}

export const useHomeContext = () => useContext(HomeContext);