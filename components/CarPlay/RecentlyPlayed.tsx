import { getImageFilePath } from "../../api/queries/functions/images";
import Client from "../../api/client";
import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import { GridTemplate, ListTemplate } from "react-native-carplay";

export const CarPlayRecentlyPlayed = (recentTracks : BaseItemDto[]) => new ListTemplate({
    title: "Recently Played",
    items: recentTracks.map(track => {
        return {
            id: track.Id!,
            text: track.Name ? track.Name : "Untitled Track",
            // image: {
            //     uri: `file://${getImageFilePath(track.Id!, 150, 150, ImageType.Primary)}`
            // }
        }
    })     
})