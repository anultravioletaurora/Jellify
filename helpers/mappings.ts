import { BaseItemDto, ImageType } from "@jellyfin/sdk/lib/generated-client/models";
import { JellifyTrack } from "../types/JellifyTrack";
import { RatingType, TrackType } from "react-native-track-player";
import { QueuingType } from "../enums/queuing-type";
import querystring from "querystring"
import { getImageApi } from "@jellyfin/sdk/lib/utils/api";
import Client from "../api/client";
import { isUndefined } from "lodash";

// TODO: Make this configurable
const transcodingContainer = "m4a";

export function mapDtoToTrack(item: BaseItemDto, queuingType?: QueuingType) : JellifyTrack {

    const urlParams = {
        "Container": item.Container,
        "TranscodingContainer": transcodingContainer,
        "TranscodingProtocol": "hls",
        "EnableRemoteMedia": true,
        "EnableRedirection": true,
        "api_key": Client.api!.accessToken,
        "StartTimeTicks": 0,
        "PlaySessionId": Client.sessionId,
    }

    const isFavorite = !isUndefined(item.UserData) && (item.UserData.IsFavorite ?? false);

    return {
        url: `${Client.api!.basePath}/Audio/${item.Id!}/universal?${querystring.stringify(urlParams)}`,
        type: TrackType.HLS,
        headers: {
            "X-Emby-Token": Client.api!.accessToken
        },
        title: item.Name,
        album: item.Album,
        artist: item.Artists?.join(", "),
        duration: item.RunTimeTicks,
        artwork: getImageApi(Client.api!).getItemImageUrlById(item.Id!, ImageType.Primary, { width: 300, height: 300 }),

        rating: isFavorite ? RatingType.Heart : undefined,
        item,
        QueuingType: queuingType ?? QueuingType.DirectlyQueued
    } as JellifyTrack
}