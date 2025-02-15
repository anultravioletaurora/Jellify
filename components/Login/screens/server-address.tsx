import React, { useState } from "react";
import _ from "lodash";
import { useMutation } from "@tanstack/react-query";
import { JellifyServer } from "../../../types/JellifyServer";
import { Input, Spacer, Spinner, XStack, ZStack } from "tamagui";
import { SwitchWithLabel } from "../../Global/helpers/switch-with-label";
import { H2 } from "../../Global/helpers/text";
import Button from "../../Global/helpers/button";
import { http, https } from "../utils/constants";
import { JellyfinInfo } from "../../../api/info";
import { Jellyfin } from "@jellyfin/sdk/lib/jellyfin";
import { getSystemApi } from "@jellyfin/sdk/lib/utils/api/system-api";
import { SafeAreaView } from "react-native-safe-area-context";
import Client from "../../../api/client";
import { useAuthenticationContext } from "../provider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../components/types";

import * as Burnt from "burnt";

export default function ServerAddress({ 
    navigation
}: {
    navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {

    navigation.setOptions({
        animationTypeForReplace: 'push'
    })

    const [useHttps, setUseHttps] = useState<boolean>(true);
    const [serverAddress, setServerAddress] = useState<string | undefined>(undefined);

    const { server, setServer } = useAuthenticationContext();

    const useServerMutation = useMutation({
        mutationFn: () => {
            let jellyfin = new Jellyfin(JellyfinInfo);

            if (!!!serverAddress) 
                throw new Error("Server address was empty");

            let api = jellyfin.createApi(`${useHttps ? https : http}${serverAddress}`);

            return getSystemApi(api).getPublicSystemInfo();
        },
        onSuccess: (publicSystemInfoResponse) => {
            if (!!!publicSystemInfoResponse.data.Version)
                throw new Error("Jellyfin instance did not respond");
    
            console.log(`Connected to Jellyfin ${publicSystemInfoResponse.data.Version!}`);
    
            const server: JellifyServer = {
                url: `${useHttps ? https : http}${serverAddress!}`,
                address: serverAddress!,
                name: publicSystemInfoResponse.data.ServerName!,
                version: publicSystemInfoResponse.data.Version!,
                startUpComplete: publicSystemInfoResponse.data.StartupWizardCompleted!
            }

            Client.setPublicApiClient(server);
            setServer(server);

            navigation.navigate("ServerAuthentication", { server });
        },
        onError: async (error: Error) => {
            console.error("An error occurred connecting to the Jellyfin instance", error);
            Client.signOut();
            setServer(undefined);

            Burnt.toast({
                title: "Unable to connect",
                preset: "error",
                // message: `Unable to connect to Jellyfin at ${useHttps ? https : http}${serverAddress}`,
            });
        }
    });

    return (
        <SafeAreaView>
            <H2 marginVertical={"$7"} marginHorizontal={"$2"}>Connect to Jellyfin</H2>
            <XStack marginBottom={"$3"}>
                <SwitchWithLabel 
                    checked={useHttps} 
                    onCheckedChange={(checked) => setUseHttps(checked)} 
                    label="Use HTTPS" 
                    size="$2"
                    width={100}
                 />
                    
                
                <Spacer />

                <Input 
                    onChangeText={setServerAddress}
                    autoCapitalize="none"
                    autoCorrect={false}
                    flexGrow={1}
                    placeholder="jellyfin.org"
                />
            </XStack>

            <ZStack>
            { useServerMutation.isPending && (
                    <Spinner />
            )}

                <Button 
                    disabled={_.isEmpty(serverAddress)}
                    onPress={() => {
                        useServerMutation.mutate();
                    }}>
                    Connect
                </Button>
            </ZStack>
        </SafeAreaView>
    )
}