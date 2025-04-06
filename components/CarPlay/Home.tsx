import { QueryKeys } from "../../enums/query-keys";
import Client from "../../api/client";
import { fetchRecentlyPlayed } from "../../api/queries/functions/recents";
import { CarPlay, ListTemplate } from "react-native-carplay";
import { queryClient } from "../../constants/query-client";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import ListItemTemplate from "./ListTemplate";

const CarPlayHome : ListTemplate = new ListTemplate({
    title: "Home",
    tabTitle: "Home",
    sections: [
        {
            header: `Hi ${Client.user?.name ?? "there"}`,
            items: [
                { text: 'Recent Artists' },
                { text: 'Recently Played'},
                { text: 'Your Playlists'}
            ]
        }
    ],
    onItemSelect: async ({ index }) => {

        console.debug(`Home item selected`);

        switch (index) {
            case 0: 
                const artists = queryClient.getQueryData<BaseItemDto[]>([QueryKeys.RecentlyPlayedArtists]);
                CarPlay.pushTemplate(ListItemTemplate(artists))
                break;
            case 1:
                const tracks = await fetchRecentlyPlayed()
                CarPlay.pushTemplate(ListItemTemplate(tracks))
                break;
            case 2:
                const playlists = queryClient.getQueryData<BaseItemDto[]>([QueryKeys.UserPlaylists])
                CarPlay.pushTemplate(ListItemTemplate(playlists))
                break;

        }
    }
});

export default CarPlayHome;