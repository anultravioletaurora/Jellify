import Track from "@/components/Global/components/track";
import { usePlayerContext } from "@/player/provider";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Queue(): React.JSX.Element {

    const { queue, useSkip } = usePlayerContext();

    return (
        <SafeAreaView edges={["right", "left"]}>
            <FlatList
                data={queue}
                numColumns={1}
                renderItem={({ item: queueItem, index }) => {
                    return (
                        <Track
                            track={queueItem.item}
                            tracklist={queue.map((track) => track.item)}
                            index={index}
                            showArtwork
                            onPress={() => {
                                useSkip.mutate(index);
                            }}
                        />
                    )
                }}
            />
        </SafeAreaView>
    )
}