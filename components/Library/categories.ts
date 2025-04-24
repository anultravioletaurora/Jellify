import { QueryKeys } from '../../enums/query-keys'

interface CategoryRoute {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	name: any // ¯\_(ツ)_/¯
	iconName: string
	params?: {
		query: QueryKeys
	}
}

const Categories: CategoryRoute[] = [
	{
		name: 'Artists',
		iconName: 'microphone-variant',
		params: { query: QueryKeys.FavoriteArtists },
	},
	{ name: 'Albums', iconName: 'music-box-multiple', params: { query: QueryKeys.FavoriteAlbums } },
	{ name: 'Tracks', iconName: 'music-note', params: { query: QueryKeys.FavoriteTracks } },
	{ name: 'Playlists', iconName: 'playlist-music' },
]

export default Categories
