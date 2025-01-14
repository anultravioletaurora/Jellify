import React from "react";
import Button from "../../Global/helpers/button";
import { useApiClientContext } from "../../jellyfin-api-provider";
import { stop } from "react-native-track-player/lib/src/trackPlayer";

export default function SignOut(): React.JSX.Element {

    const { signOut } = useApiClientContext();

    return (
        <Button onPress={() => {
            stop();
            signOut();
        }}>
            Sign Out
        </Button>
    )
}