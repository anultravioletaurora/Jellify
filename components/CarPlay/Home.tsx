import { QueryKeys } from "../../enums/query-keys";
import Client from "../../api/client";
import { fetchRecentlyPlayed, fetchRecentlyPlayedArtists } from "../../api/queries/functions/recents";
import { CarPlay, ListTemplate } from "react-native-carplay";
import { CarPlayRecentlyPlayed } from "./RecentlyPlayed";

const CarPlayHome : ListTemplate = new ListTemplate({
    id: 'Home',
    title: "Home",
    tabTitle: "Home",
    sections: [
        {
            header: `Hi ${Client.user?.name ?? "there"}`,
            items: [
                { id: QueryKeys.RecentlyPlayedArtists, text: 'Recent Artists' },
                { id: QueryKeys.RecentlyPlayed, text: 'Recently Played'},
                { id: QueryKeys.UserPlaylists, text: 'Your Playlists'}
            ]
        }
    ],
    onItemSelect: async ({ index }) => {

        switch (index) {
            case 0: 

                break;
            case 1:
                const tracks = await fetchRecentlyPlayed()
                CarPlay.pushTemplate(CarPlayRecentlyPlayed(tracks))
                break;
            case 2:

                break;

        }
    }
});

export default CarPlayHome;