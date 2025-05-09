import _ from 'lodash'
import React from 'react'
import Navigation from './navigation'
import { PlayerProvider } from '../providers/Player'
import { JellifyProvider, useJellifyContext } from '../providers'
import { JellifyUserDataProvider } from '../providers/UserData'
import { NetworkContextProvider } from '../providers/Network'
import { QueueProvider } from '../providers/Player/queue'
import { DisplayProvider } from '../providers/Display/display-provider'

/**
 * The main component for the Jellify app. Children are wrapped in the {@link JellifyProvider}
 * @returns The {@link Jellify} component
 */
export default function Jellify(): React.JSX.Element {
	return (
		<DisplayProvider>
			<JellifyProvider>
				<App />
			</JellifyProvider>
		</DisplayProvider>
	)
}
/**
 * The main component for the Jellify app. Depends on {@link useJellifyContext} hook to determine if the user is logged in
 * @returns The {@link App} component
 */
function App(): React.JSX.Element {
	return (
		<JellifyUserDataProvider>
			<NetworkContextProvider>
				<QueueProvider>
					<PlayerProvider>
						<Navigation />
					</PlayerProvider>
				</QueueProvider>
			</NetworkContextProvider>
		</JellifyUserDataProvider>
	)
}
