import React from "react";
import type { CardProps as TamaguiCardProps } from "tamagui"
import { H5, Card as TamaguiCard, View } from "tamagui";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import invert from "invert-color"
import { Blurhash } from "react-native-blurhash"
import { Text } from "../helpers/text";
import BlurhashedImage from "./blurhashed-image";

interface CardProps extends TamaguiCardProps {
    caption?: string | null | undefined;
    subCaption?: string | null | undefined;
    item: BaseItemDto;
    cornered?: boolean;
}

export function ItemCard(props: CardProps) {

    const dimensions = props.width && typeof(props.width) === "number" ? { width: props.width, height: props.width } : { width: 150, height: 150 };

    const logoDimensions = props.width && typeof(props.width) === "number" ? { width: props.width / 2, height: props.width / 3 }: { width: 100, height: 30 };

    return (
        <View 
            alignItems="center"
            margin={5}
            >
            <TamaguiCard 
                size="$4" 
                borderRadius={props.cornered ? 2 : 25}
                animation="bouncy"
                hoverStyle={props.onPress ? { scale: 0.925 } : {}}
                pressStyle={props.onPress ? { scale: 0.875 } : {}}
                width={props.width ?? 150}
                height={props.width ?? 150}
                {...props}
            >
                <TamaguiCard.Header>
                </TamaguiCard.Header>
                <TamaguiCard.Footer padded>
                    { props.item.Type === 'MusicArtist' && (
                        <BlurhashedImage
                            item={props.item}
                            type={ImageType.Logo}
                            width={logoDimensions.width}
                            height={logoDimensions.height}
                            />
                        )}
                </TamaguiCard.Footer>
                <TamaguiCard.Background>
                <BlurhashedImage
                        item={props.item}
                        width={dimensions.width}
                        height={dimensions.height}
                        cornered={props.cornered}
                    />
                </TamaguiCard.Background>
            </TamaguiCard>
            { props.caption && (
                <View 
                    alignContent="center"
                    alignItems="center"
                    width={dimensions.width}
                >
                    <Text 
                        bold
                        lineBreakStrategyIOS="standard"
                        numberOfLines={1}
                    >
                        { props.caption }
                    </Text>
            
                    { props.subCaption && (
                        <Text
                            lineBreakStrategyIOS="standard"
                            numberOfLines={1}
                            textAlign="center"
                        >
                            { props.subCaption }
                        </Text>
                    )}
                </View>
            )}
        </View>
    )
}
