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
	{ name: 'Account', iconName: 'account-key-outline' },
	{ name: 'Server', iconName: 'server-network' },
	{ name: 'Playback', iconName: 'disc-player' },
	{ name: 'Labs', iconName: 'flask-outline' },
	{ name: 'Downloads', iconName: 'download' }, // Added Downloads category
]

export default Categories
