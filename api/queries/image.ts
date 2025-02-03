import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "../../enums/query-keys";
import { fetchItemImage } from "./functions/images";
import { ImageType } from "@jellyfin/sdk/lib/generated-client/models";

export const useItemImage = (itemId: string, imageType?: ImageType, width?: number, height?: number) => useQuery({
    queryKey: [QueryKeys.ItemImage, itemId, imageType, width, height],
    queryFn: () => fetchItemImage(itemId, imageType, width, height),
    staleTime: 1000 * 60, // One minute, these are stored on disk anyways
    gcTime: 1000 * 60 * 60 // One hour, could be less maybe?
});