import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import React, { useEffect, useState } from "react";
import Icon from "../helpers/icon";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isUndefined } from "lodash";
import { getTokens, Spinner } from "tamagui";
import Client from "../../../api/client";
import { usePlayerContext } from "../../..//player/provider";
import { queryClient } from "../../../constants/query-client";
import { QueryKeys } from "../../../enums/query-keys";
import { trigger } from "react-native-haptic-feedback";
import { fetchUserData } from "../../../api/queries/functions/favorites";

interface SetFavoriteMutation {
    item: BaseItemDto,
}

export default function FavoriteButton({ 
    item,
    onToggle
}: {
    item: BaseItemDto;
    onToggle?: () => void
}) : React.JSX.Element {

    const { nowPlaying, nowPlayingIsFavorite } = usePlayerContext();

    const [isFavorite, setIsFavorite] = useState<boolean>(isFavoriteItem(item));

    const { data, isFetching, isFetched, refetch } = useQuery({
        queryKey: [QueryKeys.UserData, item.Id!],
        queryFn: () => fetchUserData(item.Id!)
    });;

    const useSetFavorite = useMutation({
        mutationFn: async (mutation: SetFavoriteMutation) => {
            return getUserLibraryApi(Client.api!)
                .markFavoriteItem({
                    itemId: mutation.item.Id!
                })
        },
        onSuccess: () => {
            trigger("notificationSuccess");

            setIsFavorite(true);
            onToggle ? onToggle() : {};

            // Force refresh of track user data
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.UserData, item.Id],
                exact: true
            });

            if (item.Type === 'Audio') {
                queryClient.invalidateQueries({
                    queryKey: [QueryKeys.ItemTracks]
                });
            }
        }
    })
    
    const useRemoveFavorite = useMutation({
        mutationFn: async (mutation: SetFavoriteMutation) => {
            return getUserLibraryApi(Client.api!)
                .unmarkFavoriteItem({
                    itemId: mutation.item.Id!
                })
        },
        onSuccess: () => {
            setIsFavorite(false);
            onToggle ? onToggle(): {};
        }
    })

    const toggleFavorite = () => {
        if (isFavorite)
            useRemoveFavorite.mutate({ item })
        else
            useSetFavorite.mutate({ item })
    }

    useEffect(() => {
        if (isFetched 
            && !isUndefined(data) 
            && !isUndefined(data.IsFavorite)
        )
            setIsFavorite(data.IsFavorite)
    }, [
        isFetched,
        data
    ])

    useEffect(() => {
        refetch();
    }, [
        item
    ]);

    return (
        isFetching && isUndefined(item.UserData) ? (
            <Spinner />
        ) : (
            <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                color={getTokens().color.telemagenta.val}
                onPress={toggleFavorite}
            /> 

        )
    )
}

export function isFavoriteItem(item: BaseItemDto) : boolean {
    return isUndefined(item.UserData) ? false 
        : isUndefined(item.UserData.IsFavorite) ? false
        : item.UserData.IsFavorite
}