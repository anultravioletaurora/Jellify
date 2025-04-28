import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { QueryKeys } from '../../enums/query-keys'
import { Queue } from '../../player/types/queue-item'

interface CategoryRoute {
	/* eslint-disable @typescript-eslint/no-explicit-any */
	name: any // ¯\_(ツ)_/¯
	iconName: string
	params?: {
		queue?: Queue
		tracks?: BaseItemDto[]
		artists?: BaseItemDto[]
	}
}

const Categories: CategoryRoute[] = [
	{ name: 'Artists', iconName: 'microphone-variant', params: {} },
	{ name: 'Albums', iconName: 'music-box-multiple', params: {} },
	{ name: 'Tracks', iconName: 'music-note', params: { queue: 'Favorite Tracks' } },
	{ name: 'Playlists', iconName: 'playlist-music' },
]

export default Categories
