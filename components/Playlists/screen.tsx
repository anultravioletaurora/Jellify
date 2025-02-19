import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import FavoritePlaylists from "./component";
import React from "react";

export default function PlaylistsScreen(
    props: NativeStackScreenProps<StackParamList, 'Playlists'>
) : React.JSX.Element {
    return (
        <FavoritePlaylists {...props} />
    )
}