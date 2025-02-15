import { Dirs, FileSystem } from "react-native-file-access";
import Button from "../../../components/Global/helpers/button";
import { ScrollView } from "tamagui";
import { useMutation } from "@tanstack/react-query";


export default function DevTools() : React.JSX.Element {

    const cleanImageDirectory = useMutation({
        mutationFn: () => FileSystem.unlink(`${Dirs.CacheDir}/images/*`)
    })

    return (
        <ScrollView 
            contentInsetAdjustmentBehavior="automatic"
            removeClippedSubviews
        >
            <Button onPress={cleanImageDirectory.mutate}>Clean Image Cache</Button>
        </ScrollView>
    )
}