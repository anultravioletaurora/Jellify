import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "tamagui";
import RecentlyAdded from "./helpers/just-added";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { H2 } from "../Global/helpers/text";

export default function Index({ navigation }: { navigation : NativeStackNavigationProp<StackParamList> }) : React.JSX.Element {
    return (
        <SafeAreaView edges={["top", "left", "right"]}>
            <ScrollView
                flexGrow={1}
                contentInsetAdjustmentBehavior="automatic"
                removeClippedSubviews
                paddingBottom={"$15"}
            >
                <H2>{`Recently added`}</H2>
                <RecentlyAdded navigation={navigation} />
            </ScrollView>
        </SafeAreaView>
    )
}