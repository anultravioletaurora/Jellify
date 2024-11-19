import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { Select, View } from "tamagui";
import { JellifyLibrary } from "../../../types/JellifyLibrary";
import { mutateServerCredentials } from "../../../api/mutators/functions/storage";
import { useAuthenticationContext } from "../provider";
import { Heading } from "../../helpers/text";
import Button from "../../helpers/button";
import _ from "lodash";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models/base-item-dto";
import { Api } from "@jellyfin/sdk";
import { fetchMusicLibraries } from "../../../api/queries/functions/libraries";
import { QueryKeys } from "../../../enums/query-keys";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ActivityIndicator } from "react-native";

export default function ServerLibrary(): React.JSX.Element {

    const { server, setChangeUsername, libraryName, setLibraryName, libraryId, setLibraryId } = useAuthenticationContext();

    const { apiClient, setAccessToken } = useApiClientContext();
    
    const useLibraries = (api: Api) => useQuery({
        queryKey: [QueryKeys.Libraries, api],
        queryFn: async ({ queryKey }) => await fetchMusicLibraries(queryKey[1] as Api)
    });
    
    const { data : libraries, isPending, refetch } = useLibraries(apiClient!);

    const clearUser = useMutation({
        mutationFn: async () => {
            setChangeUsername(true);
            setAccessToken(undefined)
            return await mutateServerCredentials(server!.url);
        }
    });

    useEffect(() => {
        refetch();
    }, [
        server,
        apiClient
    ])

    return (
        <View marginHorizontal={10} flex={1} justifyContent='center'>
            <Heading>Select Music Library</Heading>

            { isPending && (
                <ActivityIndicator />
            )}

            { !_.isUndefined(libraries) &&
                <Select defaultValue="">
                    <Select.Trigger>
                        <Select.Value placeholder="Libraries" />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Viewport animation="quick">
                            <Select.Group>
\                               <Select.Label>Music Libraries</Select.Label>
                                { libraries.map((item, i) => {
                                    return (
                                        <Select.Item
                                        index={i}
                                        key={item.Name!}
                                        value={item.Name!}
                                        >
                                            <Select.ItemText>{item.Name!}</Select.ItemText>
                                            <Select.ItemIndicator marginLeft="auto">
                                                <Icon name="check" size={16} />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    )
                                })}
                            </Select.Group>
                        </Select.Viewport>
                    </Select.Content>
                </Select>
            }

            <Button
                onPress={() => {
                    clearUser.mutate();
                }}
            >
                Switch User
            </Button>

            <Select value={libraryName}></Select>
        </View>
    )
}