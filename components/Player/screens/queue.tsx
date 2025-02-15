import Icon from "../../../components/Global/helpers/icon";
import Track from "../../../components/Global/components/track";
import { StackParamList } from "../../../components/types";
import { usePlayerContext } from "../../../player/provider";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import DraggableFlatList from "react-native-draggable-flatlist";
import { trigger } from "react-native-haptic-feedback";
import { getTokens, Separator } from "tamagui";
import { FadeIn, FadeOut, ReduceMotion, SequencedTransition } from "react-native-reanimated";

export default function Queue({ navigation }: { navigation: NativeStackNavigationProp<StackParamList>}): React.JSX.Element {

    const { width } = useSafeAreaFrame();
    const { playQueue, queue, useClearQueue, useRemoveFromQueue, useReorderQueue, useSkip, nowPlaying } = usePlayerContext();

    navigation.setOptions({
        headerRight: () => {
            return (
                <Icon name="notification-clear-all" onPress={() => {
                    useClearQueue.mutate()
                }}/>
            )
        }
    })

    const scrollIndex = playQueue.findIndex(queueItem => queueItem.item.Id! === nowPlaying!.item.Id!)

    return (
        <DraggableFlatList
            contentInsetAdjustmentBehavior="automatic"
            data={playQueue}
            dragHitSlop={{ left: -50 }} // https://github.com/computerjazz/react-native-draggable-flatlist/issues/336
            extraData={nowPlaying}
            // enableLayoutAnimationExperimental
            getItemLayout={(data, index) => (
                { length: width / 9, offset: width / 9 * index, index}
            )}
            initialScrollIndex={scrollIndex !== -1 ? scrollIndex: 0}
            ItemSeparatorComponent={() => <Separator />}
            // itemEnteringAnimation={FadeIn}
            // itemExitingAnimation={FadeOut}
            // itemLayoutAnimation={SequencedTransition}
            keyExtractor={({ item }, index) => {
                return `${index}-${item.Id}`
            }}
            numColumns={1}
            onDragEnd={({ data, from, to}) => {
                useReorderQueue.mutate({ newOrder: data, from, to });
            }}
            renderItem={({ item: queueItem, getIndex, drag, isActive }) => {

                const index = getIndex();

                return (
                    <Track
                        queue={queue}
                        navigation={navigation}
                        track={queueItem.item}
                        index={getIndex()}
                        showArtwork
                        onPress={() => {
                            useSkip.mutate(index);
                        }}
                        onLongPress={() => {
                            trigger('impactLight');
                            drag();
                        }}
                        isNested
                        showRemove
                        onRemove={() => {
                            if (index)
                                useRemoveFromQueue.mutate(index)
                        }}
                    />
                )
            }}
            style={{
                overflow: 'hidden' // Prevent unnecessary memory usage
            }} 
        />
    )
}