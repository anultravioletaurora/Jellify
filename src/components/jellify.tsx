import _ from 'lodash'
import React from 'react'
import Navigation from './navigation'
import { PlayerProvider } from '../providers/Player'
import { JellifyProvider, useJellifyContext } from '../providers'
import { JellifyUserDataProvider } from '../providers/UserData'
import { NetworkContextProvider } from '../providers/Network'
import { QueueProvider } from '../providers/Player/queue'
import { DisplayProvider } from '../providers/Display/display-provider'
import { SettingsProvider, useSettingsContext } from '../providers/Settings'
import { createTelemetryDeck, TelemetryDeckProvider } from '@typedigital/telemetrydeck-react'
import telemetryDeckConfig from '../../telemetrydeck.json'
import glitchtipConfig from '../../glitchtip.json'
import * as Sentry from '@sentry/react-native'

/**
 * The main component for the Jellify app. Children are wrapped in the {@link JellifyProvider}
 * @returns The {@link Jellify} component
 */
export default function Jellify(): React.JSX.Element {
	return (
		<SettingsProvider>
			<JellifyLoggingWrapper>
				<DisplayProvider>
					<JellifyProvider>
						<App />
					</JellifyProvider>
				</DisplayProvider>
			</JellifyLoggingWrapper>
		</SettingsProvider>
	)
}

function JellifyLoggingWrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
	const { sendMetrics } = useSettingsContext()

	let telemetrydeck = undefined
	if (sendMetrics) {
		telemetrydeck = createTelemetryDeck(telemetryDeckConfig)
	}

	Sentry.init({
		...glitchtipConfig,
		enabled: sendMetrics,
	})

	return sendMetrics && telemetrydeck ? (
		<TelemetryDeckProvider telemetryDeck={telemetrydeck}>{children}</TelemetryDeckProvider>
	) : (
		<>{children}</>
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
