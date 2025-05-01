import { isUndefined } from 'lodash'
import { createContext, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { CarPlay } from 'react-native-carplay'
import Client from '../api/client'
import CarPlayNavigation from './CarPlay/Navigation'
import { Platform } from 'react-native'

interface JellifyContext {
	loggedIn: boolean
	setLoggedIn: React.Dispatch<SetStateAction<boolean>>
	carPlayConnected: boolean
}

const JellifyContextInitializer = () => {
	const [loggedIn, setLoggedIn] = useState<boolean>(
		!isUndefined(Client) &&
			!isUndefined(Client.api) &&
			!isUndefined(Client.user) &&
			!isUndefined(Client.server) &&
			!isUndefined(Client.library),
	)

	const [carPlayConnected, setCarPlayConnected] = useState(CarPlay ? CarPlay.connected : false)

	useEffect(() => {
		function onConnect() {
			setCarPlayConnected(true)

			if (loggedIn) {
				CarPlay.setRootTemplate(CarPlayNavigation)

				if (Platform.OS === 'ios') {
					CarPlay.enableNowPlaying(true) // https://github.com/birkir/react-native-carplay/issues/185
				}
			}
		}

		function onDisconnect() {
			setCarPlayConnected(false)
		}

		if (CarPlay) {
			CarPlay.registerOnConnect(onConnect)
			CarPlay.registerOnDisconnect(onDisconnect)
			return () => {
				CarPlay.unregisterOnConnect(onConnect)
				CarPlay.unregisterOnDisconnect(onDisconnect)
			}
		}
	})

	return {
		loggedIn,
		setLoggedIn,
		carPlayConnected,
	}
}

const JellifyContext = createContext<JellifyContext>({
	loggedIn: false,
	setLoggedIn: () => {},
	carPlayConnected: false,
})

/**
 * Top level provider for Jellify. Provides the {@link JellifyContext} to all children, containing
 * whether the user is logged in, and whether the carplay is connected
 * @param children The children to render
 * @returns The {@link JellifyProvider} component
 */
export const JellifyProvider: ({ children }: { children: ReactNode }) => React.JSX.Element = ({
	children,
}: {
	children: ReactNode
}) => {
	const { loggedIn, setLoggedIn, carPlayConnected } = JellifyContextInitializer()

	return (
		<JellifyContext.Provider
			value={{
				loggedIn,
				setLoggedIn,
				carPlayConnected,
			}}
		>
			{children}
		</JellifyContext.Provider>
	)
}

export const useJellifyContext = () => useContext(JellifyContext)
