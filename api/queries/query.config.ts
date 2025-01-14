import { ImageFormat } from "@jellyfin/sdk/lib/generated-client/models";

export const queryConfig = {
    limits: {
        recents: 50 // TODO: Adjust this when we add a list navigator to the end of the recents
    },
    images: {
        fillHeight: 300,
        fillWidth: 300,
        format: ImageFormat.Jpg
    },
    banners: {
        fillHeight: 300,
        fillWidth: 1000,
        format: ImageFormat.Jpg,
    },
    logos: {
        fillHeight: 50,
        fillWidth: 300,
        format: ImageFormat.Png
    },
    playerArtwork: {
        fillHeight: 1000,
        fillWidth: 1000,
        format: ImageFormat.Jpg
    }
}