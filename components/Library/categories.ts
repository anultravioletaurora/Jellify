import { QueryKeys } from "../../enums/query-keys";

interface CategoryRoute {
    name: any; // ¯\_(ツ)_/¯
    iconName: string;
    params?: any | undefined;
};

const Categories : CategoryRoute[] = [
    { name: "Artists", iconName: "microphone-variant", params: { query: QueryKeys.FavoriteArtists } },
    { name: "Albums", iconName: "music-box-multiple" },
    { name: "Tracks", iconName: "music-note"},
    { name: "Playlists", iconName: "playlist-music"},
];

export default Categories;