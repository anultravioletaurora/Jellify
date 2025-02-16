import Item from "../../../components/Global/components/item";
import { StackParamList } from "../../../components/types"
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { FlatList } from "react-native"

interface RecentArtistsProps {
    artists: BaseItemDto[];
    navigation: NativeStackNavigationProp<StackParamList, 'RecentArtists'>;
}

export default function RecentArtistsScreen({
    artists,
    navigation
}: RecentArtistsProps) : React.JSX.Element {

    return (
        <FlatList
            data={artists}
            renderItem={({ index, item: artist }) => {
                return <Item item={artist} queueName="" navigation={navigation} />
            }}
        />
    )

}