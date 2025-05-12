import { Platform } from 'react-native'
import { storage } from '../../constants/storage'
import { MMKVStorageKeys } from '../../enums/mmkv-storage-keys'
import { createContext, useContext, useEffect, useState } from 'react'

interface SettingsContext {
	sendMetrics: boolean
	setSendMetrics: React.Dispatch<React.SetStateAction<boolean>>
	autoDownload: boolean
	setAutoDownload: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * Initializes the settings context
 *
 * By default, auto-download is enabled on iOS and Android
 *
 * By default, metrics and logs are not sent
 *
 * Settings are saved to the device storage
 *
 * @returns The settings context
 */
const SettingsContextInitializer = () => {
	const sendMetricsInit = storage.getBoolean(MMKVStorageKeys.SendMetrics)

	const autoDownloadInit = storage.getBoolean(MMKVStorageKeys.AutoDownload)

	const [sendMetrics, setSendMetrics] = useState(sendMetricsInit ?? false)

	const [autoDownload, setAutoDownload] = useState(
		autoDownloadInit ?? ['ios', 'android'].includes(Platform.OS),
	)

	useEffect(() => {
		storage.set(MMKVStorageKeys.SendMetrics, sendMetrics)
	}, [sendMetrics])

	useEffect(() => {
		storage.set(MMKVStorageKeys.AutoDownload, autoDownload)
	}, [autoDownload])

	return {
		sendMetrics,
		setSendMetrics,
		autoDownload,
		setAutoDownload,
	}
}

export const SettingsContext = createContext<SettingsContext>({
	sendMetrics: false,
	setSendMetrics: () => {},
	autoDownload: false,
	setAutoDownload: () => {},
})

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const context = SettingsContextInitializer()

	return <SettingsContext.Provider value={context}>{children}</SettingsContext.Provider>
}

export const useSettingsContext = () => useContext(SettingsContext)
