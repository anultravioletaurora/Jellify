import _ from 'lodash'
import React, { useEffect } from 'react'
import Navigation from './navigation'
import Login from './Login/component'
import { JellyfinAuthenticationProvider } from './Login/provider'
import { PlayerProvider } from '../player/player-provider'
import { useColorScheme } from 'react-native'
import { PortalProvider } from '@tamagui/portal'
import { JellifyProvider, useJellifyContext } from './provider'
import { JellifyUserDataProvider } from './user-data-provider'
import { NetworkContextProvider } from './Network/provider'
import { QueueProvider } from '../player/queue-provider'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Jellify(): React.JSX.Element {
	const insets = useSafeAreaInsets()

	useEffect(() => {
		console.debug(insets)
	}, [insets])

	return (
		<PortalProvider shouldAddRootHost>
			<JellifyProvider>
				<App />
			</JellifyProvider>
		</PortalProvider>
	)
}

function App(): React.JSX.Element {
	const isDarkMode = useColorScheme() === 'dark'
	const { loggedIn } = useJellifyContext()

	return loggedIn ? (
		<JellifyUserDataProvider>
			<NetworkContextProvider>
				<QueueProvider>
					<PlayerProvider>
						<Navigation />
					</PlayerProvider>
				</QueueProvider>
			</NetworkContextProvider>
		</JellifyUserDataProvider>
	) : (
		<JellyfinAuthenticationProvider>
			<Login />
		</JellyfinAuthenticationProvider>
	)
}
