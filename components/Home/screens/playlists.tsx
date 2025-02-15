import Item from "../../../components/Global/components/item";
import { StackParamList } from "../../../components/types"
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FlatList } from "react-native"

interface UserPlaylistsProps {
    playlists: BaseItemDto[];
    navigation: NativeStackNavigationProp<StackParamList, 'UserPlaylists'>;
}

export default function RecentArtistsScreen({
    playlists,
    navigation
}: UserPlaylistsProps) : React.JSX.Element {

    return (
        <FlatList
            data={playlists}
            renderItem={({ index, item: artist }) => {
                return <Item item={artist} queueName="" navigation={navigation} />
            }}
            style={{
                overflow: 'hidden' // Prevent unnecessary memory usage
            }} 
        />
    )

}