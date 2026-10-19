import { getSystemApi } from '@jellyfin/sdk/lib/utils/api'

import { Jellyfin } from '@jellyfin/sdk/lib/jellyfin'
import { JellyfinInfo } from '../../../info'
import { PublicSystemInfo } from '@jellyfin/sdk/lib/generated-client/models'
import { Api } from '@jellyfin/sdk'
import { AxiosResponse } from 'axios'
import HTTPS, { HTTP } from '../../../../constants/protocols'
import { captureError } from '../../../../utils/logging'
import LoggingContext from '../../../../utils/logging/enums'

type ConnectionType = 'hostname' | 'ipAddress'

/**
 * Attempts to connect to a Jellyfin server.
 *
 * @param serverAddress The server address to connect to.
 * @returns The public system info response.
 */
export async function connectToServer(serverAddress: string): Promise<{
	publicSystemInfoResponse: PublicSystemInfo
	connectionType: ConnectionType
	resolvedUrl: string
}> {
	if (!serverAddress) throw new Error('Server address was empty')

	const serverAddressContainsProtocol =
		serverAddress.startsWith(HTTP) || serverAddress.startsWith(HTTPS)

	const jellyfin = new Jellyfin(JellyfinInfo)

	// Use the protocol provided in the server address if it exists, otherwise default to HTTPS
	const hostnameApi = jellyfin.createApi(
		`${serverAddressContainsProtocol ? '' : HTTPS}${serverAddress}`,
	)

	const httpApi = !serverAddressContainsProtocol
		? jellyfin.createApi(`${HTTP}${serverAddress}`)
		: undefined

	// First attempt to connect using the hostname (with the protocol provided or defaulting to HTTPS)
	try {
		return await connect(hostnameApi, 'hostname')
	} catch (error) {
		console.info('Unable to connect, attempting to connect via HTTP if available')
	}

	// If the first attempt fails and we haven't already tried HTTP, attempt to connect using HTTP
	if (httpApi) {
		try {
			return await connect(httpApi, 'ipAddress')
		} catch (error) {
			console.info('Unable to connect via HTTP')
		}
	}

	throw new Error('Unable to connect to Jellyfin')
}

function connect(api: Api, connectionType: ConnectionType) {
	return getSystemApi(api)
		.getPublicSystemInfo()
		.then((response) => {
			if (!response.data.Version)
				throw new Error(
					`Jellyfin instance did not respond to our ${connectionType} request`,
				)

			return {
				publicSystemInfoResponse: response.data,
				connectionType,
				resolvedUrl: resolveBaseUrl(response, api.basePath),
			}
		})
		.catch((error) => {
			captureError(
				error,
				LoggingContext.PublicSystemInfo,
				`Failed to connect to Jellyfin via ${connectionType}`,
			)
			throw new Error(`Unable to connect to Jellyfin via ${connectionType}`)
		})
}

const PUBLIC_INFO_PATH = '/System/Info/Public'

/**
 * Derives the server base URL from the final (post-redirect) request URL,
 * falling back to the URL we originally requested.
 */
function resolveBaseUrl(response: AxiosResponse, requestedBasePath: string): string {
	const finalUrl: unknown = response.request?.responseURL ?? response.request?.res?.responseUrl
	if (typeof finalUrl !== 'string') return requestedBasePath

	const index = finalUrl.indexOf(PUBLIC_INFO_PATH)
	return index > 0 ? finalUrl.slice(0, index) : requestedBasePath
}
