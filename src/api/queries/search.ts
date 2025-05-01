import Client from '../client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getItemsApi } from '@jellyfin/sdk/lib/utils/api'
import { isEmpty, trim } from 'lodash'
import QueryConfig from './query.config'

/**
 * Performs a search for items against the Jellyfin server, trimming whitespace
 * around the search term for the best possible results.
 * @param searchString The search term to look up against
 * @returns A promise of a BaseItemDto array, be it empty or not
 */
export async function fetchSearchResults(searchString: string | undefined): Promise<BaseItemDto[]> {
	return new Promise((resolve, reject) => {
		console.debug('Searching Jellyfin for items')

		if (isEmpty(searchString)) resolve([])

		getItemsApi(Client.api!)
			.getItems({
				searchTerm: trim(searchString),
				recursive: true,
				includeItemTypes: ['MusicArtist', 'Audio', 'MusicAlbum', 'Playlist'],
				limit: QueryConfig.limits.search,
				sortBy: ['IsFolder'],
				sortOrder: ['Descending'],
			})
			.then((response) => {
				if (response.data.Items) resolve(response.data.Items)
				else resolve([])
			})
			.catch((error) => {
				reject(error)
			})
	})
}
