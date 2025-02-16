import React from "react";
import { SafeAreaView } from "react-native";
import { ListItem, ScrollView, Separator, YGroup } from "tamagui";
import SignOut from "./helpers/sign-out";
import ServerDetails from "./helpers/server-details";
import LibraryDetails from "./helpers/library-details";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../types";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export default function Root({ 
    navigation 
}: { 
    navigation: NativeStackNavigationProp<StackParamList>
}) : React.JSX.Element {

    const { width } = useSafeAreaFrame();

    return (
        <ScrollView 
            contentInsetAdjustmentBehavior="automatic"
            removeClippedSubviews
        >
            <YGroup 
                alignSelf="center" 
                bordered 
                width={width / 1.5} 
            >
                <YGroup.Item>
                    <ListItem
                        hoverTheme
                        pressTheme
                        title="Account Details"
                        subTitle="Everything is about you, man"
                        onPress={() => {
                            navigation.navigate("AccountDetails")
                        }}
                    />
                </YGroup.Item>
                <YGroup.Item>
                    <ListItem
                        hoverTheme
                        pressTheme
                        title="Developer Tools"
                        subTitle="Nerds rule!"
                        onPress={() => {
                            navigation.navigate("DevTools");
                        }}
                    />
                </YGroup.Item>
            </YGroup>

            <ServerDetails />
            <Separator marginVertical={15} />
            <LibraryDetails />
            <SignOut />
        </ScrollView>
    )
}