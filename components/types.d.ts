import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


export type StackParamList = {
    Home: undefined;

    Discover: undefined;

    Favorites: undefined;
    Artists: undefined;
    Albums: undefined;
    Tracks: undefined;
    Genres: undefined;
    Playlists: undefined;

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

export type ProvidedHomeProps = NativeStackScreenProps<StackParamList, 'Home'>;

export type DiscoverProps = NativeStackScreenProps<StackParamList, 'Discover'>;

export type TabProps = NativeStackScreenProps<StackParamList, 'Tabs'>;

export type PlayerProps = NativeStackScreenProps<StackParamList, 'Player'>;

export type HomeArtistProps = NativeStackScreenProps<StackParamList, 'Artist'>;

export type HomeAlbumProps = NativeStackScreenProps<StackParamList, 'Album'>;

export type HomePlaylistProps = NativeStackScreenProps<StackParamList, "Playlist">;

export type QueueProps = NativeStackScreenProps<StackParamList, "Queue">;

export type LibraryProps = NativeStackScreenProps<StackParamList, "Favorites">;

export type ArtistsProps = NativeStackScreenProps<StackParamList, "Artists">;

export type AlbumsProps = NativeStackScreenProps<StackParamList, "Albums">;

export type PlaylistsProps = NativeStackScreenProps<StackParamList, "Playlists">;

export type TracksProps = NativeStackScreenProps<StackParamList, "Tracks">;

export type GenresProps = NativeStackScreenProps<StackParamList, "Genres">;

export type DetailsProps = NativeStackScreenProps<StackParamList, "Details">;

export type AccountDetailsProps = NativeStackScreenProps<StackParamList, "AccountDetails">;

export type DevToolsProps = NativeStackScreenProps<StackParamList, 'DevTools'>;

export type useState<T> = [T, React.Dispatch<T>];