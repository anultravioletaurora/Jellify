import { QueryKeys } from "../enums/query-keys";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { JellifyServer } from "../types/JellifyServer";
import { JellifyUser } from "../types/JellifyUser";

export type StackParamList = {
    ServerAddress: undefined;
    ServerAuthentication: {
        server: JellifyServer
    }

    LibrarySelection: {
        user: JellifyUser
    }

    Home: undefined;
    AddPlaylist: undefined;
    RecentArtists: {
        artists: BaseItemDto[]
    };
    RecentTracks: {
        tracks: BaseItemDto[]
    };
    UserPlaylists: {
        playlists: BaseItemDto[]
    };

    Discover: undefined;

    Library: undefined;
    Artists: {
        query: QueryKeys.FavoriteArtists | QueryKeys.RecentlyPlayedArtists
    };
    Albums: {
        query: QueryKeys.FavoriteAlbums | QueryKeys.RecentlyAdded
    };
    Tracks: {
        query: QueryKeys.FavoriteTracks | QueryKeys.RecentlyPlayed
    };
    Genres: undefined;
    Playlists: undefined;
    DeletePlaylist: {
        playlist: BaseItemDto
    }

    Search: undefined;

    Settings: undefined;
    AccountDetails: undefined;
    DevTools: undefined;

    Tabs: {
        screen: string;
        params: any
    };

    Player: undefined;
    Queue: undefined;

    Artist: { 
        artist: BaseItemDto
    };
    Album: {
        album: BaseItemDto
    };
    Playlist: {
        playlist: BaseItemDto
    };
    Details: {
        item: BaseItemDto,
        isNested: boolean | undefined
    }
}

export type ServerAddressProps = NativeStackScreenProps<StackParamList, "ServerAddress">;
export type ServerAuthenticationProps = NativeStackScreenProps<StackParamList, "ServerAuthentication">;
export type LibrarySelectionProps = NativeStackScreenProps<StackParamList, "LibrarySelection">;

export type TabProps = NativeStackScreenProps<StackParamList, 'Tabs'>;
export type PlayerProps = NativeStackScreenProps<StackParamList, 'Player'>;

export type ProvidedHomeProps = NativeStackScreenProps<StackParamList, 'Home'>;
export type AddPlaylistProps = NativeStackScreenProps<StackParamList, 'AddPlaylist'>;
export type RecentArtistsProps = NativeStackScreenProps<StackParamList, 'RecentArtists'>;
export type RecentTracksProps = NativeStackScreenProps<StackParamList, 'RecentTracks'>;
export type UserPlaylistsProps = NativeStackScreenProps<StackParamList, 'UserPlaylists'>;

export type DiscoverProps = NativeStackScreenProps<StackParamList, 'Discover'>;



export type HomeArtistProps = NativeStackScreenProps<StackParamList, 'Artist'>;

export type HomeAlbumProps = NativeStackScreenProps<StackParamList, 'Album'>;

export type HomePlaylistProps = NativeStackScreenProps<StackParamList, "Playlist">;

export type QueueProps = NativeStackScreenProps<StackParamList, "Queue">;

export type LibraryProps = NativeStackScreenProps<StackParamList, "Library">;

export type ArtistsProps = NativeStackScreenProps<StackParamList, "Artists">;

export type AlbumsProps = NativeStackScreenProps<StackParamList, "Albums">;

export type FavoritePlaylistsProps = NativeStackScreenProps<StackParamList, "Playlists">;
export type DeletePlaylistProps = NativeStackScreenProps<StackParamList, "DeletePlaylist">;

export type TracksProps = NativeStackScreenProps<StackParamList, "Tracks">;

export type GenresProps = NativeStackScreenProps<StackParamList, "Genres">;

export type DetailsProps = NativeStackScreenProps<StackParamList, "Details">;

export type AccountDetailsProps = NativeStackScreenProps<StackParamList, "AccountDetails">;

export type DevToolsProps = NativeStackScreenProps<StackParamList, 'DevTools'>;

export type useState<T> = [T, React.Dispatch<T>];