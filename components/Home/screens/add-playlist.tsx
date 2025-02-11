import { Label } from "../../../components/Global/helpers/text";
import Input from "../../../components/Global/helpers/input";
import React, { useState } from "react";
import { View, XStack } from "tamagui";
import Button from "../../../components/Global/helpers/button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../components/types";
import { useMutation } from "@tanstack/react-query";
import { createPlaylist } from "../../../api/mutations/functions/playlists";
import { trigger } from "react-native-haptic-feedback";
import { queryClient } from "../../../constants/query-client";
import { QueryKeys } from "../../../enums/query-keys";


export default function AddPlaylist({ 
    navigation 
}: { 
    navigation : NativeStackNavigationProp<StackParamList, 'AddPlaylist'>
}) : React.JSX.Element {

    const [name, setName] = useState<string>("");

    const useAddPlaylist = useMutation({
        mutationFn: ({ name } : { name : string}) => createPlaylist(name),
        onSuccess: () => {
            trigger("notificationSuccess")
            navigation.goBack();

            // Refresh user playlists component on home screen
            queryClient.invalidateQueries({
                queryKey: [QueryKeys.UserPlaylists]
            });
        },
        onError: () => {
            trigger("notificationError");
        }
    })

    return (
        <View marginHorizontal={"$2"}>
            <Label size="$2" htmlFor="name">Name</Label>
            <Input id="name" onChangeText={setName} />
            <XStack justifyContent="space-evenly">
                <Button danger onPress={() => navigation.goBack()}>Cancel</Button>
                <Button onPress={() => useAddPlaylist.mutate({ name })}>Create</Button>
            </XStack>
        </View>
    )
}