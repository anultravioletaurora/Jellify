import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { NativeStackScreenProps } from "@react-navigation/native-stack";


export type StackParamList = {
    Home: undefined;
    Discover: undefined;
    Artist: { 
        artistId: string,
        artistName: string
    };
    Album: {
        album: BaseItemDto
    };
    Playlist: {
        playlist: BaseItemDto
    }
}

export type ProvidedHomeProps = NativeStackScreenProps<StackParamList, 'Home'>;

export type DiscoverProps = NativeStackScreenProps<StackParamList, 'Discover'>;

export type HomeArtistProps = NativeStackScreenProps<StackParamList, 'Artist'>;

export type HomeAlbumProps = NativeStackScreenProps<StackParamList, 'Album'>;

export type HomePlaylistProps = NativeStackScreenProps<StackParamList, "Playlist">;