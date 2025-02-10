import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { fetchItemImage } from "./functions/images";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";

export const useItemImage = (itemId: string, imageType: ImageType = ImageType.Primary, width: number = 150, height: number = 150) => useQuery({
    queryKey: [
        QueryKeys.ItemImage, 
        itemId, 
        imageType, 
        Math.ceil(width / 100) * 100, // Images are fetched at a higher, generic resolution
        Math.ceil(height / 100) * 100 // So these keys need to match
    ],
    queryFn: () => fetchItemImage(itemId, imageType, width, height),
});