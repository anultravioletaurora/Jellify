import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { Blurhash } from "react-native-blurhash";
import { View } from "tamagui";
import { isEmpty } from "lodash";
import { Image } from "react-native";
import { QueryKeys } from "../../../enums/query-keys";
import { useQuery } from "@tanstack/react-query";
import { fetchItemImage } from "../../../api/queries/functions/images";

interface BlurhashLoadingProps {
    item: BaseItemDto;
    width: number;
    height?: number;
    type?: ImageType; 
    borderRadius?: number | undefined
}

export default function BlurhashedImage({ 
    item, 
    width, 
    height,
    type,
    borderRadius
} : BlurhashLoadingProps) : React.JSX.Element {

    const { data: image, isSuccess } = useQuery({
        queryKey: [
            QueryKeys.ItemImage, 
            item.AlbumId ? item.AlbumId : item.Id!, 
            type ?? ImageType.Primary, 
            Math.ceil(width / 100) * 100, // Images are fetched at a higher, generic resolution
            Math.ceil(height ?? width / 100) * 100 // So these keys need to match
        ],
        queryFn: () => fetchItemImage(item.AlbumId ? item.AlbumId : item.Id!, type ?? ImageType.Primary, width, height ?? width),
        staleTime: (1000 * 60 * 60) * 24, // 1 day, images probably don't refresh that often
        gcTime: (1000 * 1 * 1) * 1 // 1 second, these are stored on disk anyways so refetching is cheap
    });;

    const blurhash = !isEmpty(item.ImageBlurHashes) 
        && !isEmpty(type ? item.ImageBlurHashes[type] : item.ImageBlurHashes.Primary) 
        ? Object.values(type ? item.ImageBlurHashes[type]! : item.ImageBlurHashes.Primary!)[0]
        : undefined;

    return (
        <View minHeight={height ?? width} minWidth={width} borderRadius={borderRadius ? borderRadius : 25}>

            { isSuccess ? (
                <Image 
                    source={{
                        uri: image
                    }}
                    style={{
                        height: height ?? width,
                        width,
                        borderRadius: borderRadius ? borderRadius : 25,
                        resizeMode: "contain"
                    }} 
                />
            ) : blurhash && (
                <Blurhash blurhash={blurhash!} style={{ 
                    height: height ?? width, 
                    width: width,
                    borderRadius: borderRadius ? borderRadius : 25 
                }} />
            )
        }
        </View>
    )
}