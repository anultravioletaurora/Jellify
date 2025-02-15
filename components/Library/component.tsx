import { FlatList } from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import Categories from "./categories";
import IconCard from "../../components/Global/helpers/icon-card";
import { StackParamList } from "../../components/types";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export default function Library({ 
    route, 
    navigation 
} : {
    route: RouteProp<StackParamList, "Library">,
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    const { width } = useSafeAreaFrame();

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top", "right", "left"]}>
            <FlatList
                contentInsetAdjustmentBehavior="automatic"
                data={Categories}
                numColumns={2}
                renderItem={({ index, item }) => {
                    return (
                        <IconCard 
                            name={item.iconName}
                            caption={item.name}
                            width={width / 2.1}
                            onPress={() => {
                                navigation.navigate(item.name, item.params)
                            }}
                            largeIcon
                        />
                    )
                }}
                style={{
                    overflow: 'hidden' // Prevent unnecessary memory usage
                }} 
            />
        </SafeAreaView>
    )
}