import { RouteProp } from "@react-navigation/native";
import Artist from "../component";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../types";

export function ArtistScreen({ 
    route, 
    navigation 
} : { 
    route: RouteProp<StackParamList, "Artist">, 
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    return (
        <Artist 
            artist={route.params.artist}
            navigation={navigation}
        />
    );
}