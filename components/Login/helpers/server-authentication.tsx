import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useApiClientContext } from "../../jellyfin-api-provider";
import _ from "lodash";
import * as Keychain from "react-native-keychain"
import { JellyfinCredentials } from "../../../api/types/jellyfin-credentials";
import { View } from "tamagui";
import { useAuthenticationContext } from "../provider";
import { Heading } from "../../helpers/text";
import Button from "../../helpers/button";
import Input from "../../helpers/input";
import { client } from "../../../api/client";

export default function ServerAuthentication(): React.JSX.Element {
    const { username, server, setUsername, setChangeUsername, setChangeServer } = useAuthenticationContext();
    const [password, setPassword] = React.useState<string | undefined>('');

    const { setUsername: setClientContextUsername, setServerUrl: setClientContextServerUrl, setAccessToken } = useApiClientContext();

    const useApiMutation = useMutation({
        mutationFn: async (credentials: JellyfinCredentials) => {
            return await client.createApi(server!.url).authenticateUserByName(credentials.username, credentials.password!);
        },
        onSuccess: async (authResult, credentials) => {
              
            console.log(`Received auth response from ${server!.name}`)
            if (_.isUndefined(authResult))
                return Promise.reject(new Error("Authentication result was empty"))

            if (authResult.status >= 400 || _.isEmpty(authResult.data.AccessToken))
                return Promise.reject(new Error("Invalid credentials"))

            if (_.isUndefined(authResult.data.User))
                return Promise.reject(new Error("Unable to login"));

            console.log(`Successfully signed in to ${server!.name}`);
            setClientContextUsername(username)
            setAccessToken(authResult.data.AccessToken as string);
            setChangeUsername(false);
            return await Keychain.setInternetCredentials(server!.url, credentials.username, (authResult.data.AccessToken as string));
        },
        onError: async (error: Error) => {
            console.error("An error occurred connecting to the Jellyfin instance", error);
            return Promise.reject(`An error occured signing into ${server!.name}`);
        }
    });

    return (
        <View marginHorizontal={10} flex={1} justifyContent='center'>
            <Heading>
                { `Sign in to ${server?.name ?? "Jellyfin"}`}
            </Heading>
            <Button
                onPress={() => {
                    setChangeServer(true);
                    setClientContextServerUrl(undefined);
                    setClientContextUsername(undefined);
                    setAccessToken(undefined);
                }}>
                    Switch Server
            </Button>

            <Input
                placeholder="Username"
                value={username}
                onChangeText={(value) => setUsername(value)}
                />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry
                />

            <Button 
                disabled={_.isEmpty(username) || _.isEmpty(password)}
                onPress={() => {

                    if (!_.isUndefined(username)) {
                        console.log(`Signing in to ${server!.name}`);
                        useApiMutation.mutate({ username, password });
                    }
                }}
                >
                    Sign in
            </Button>
        </View>
    );
}