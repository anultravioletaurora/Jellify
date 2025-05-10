import { storage } from '../../constants/storage'
import { MMKVStorageKeys } from '../../enums/mmkv-storage-keys'
import { createContext, useContext, useEffect, useState } from 'react'

interface SettingsContext {
	sendMetrics: boolean
	setSendMetrics: React.Dispatch<React.SetStateAction<boolean>>
}

const SettingsContextInitializer = () => {
	const sendMetricsInit = storage.getBoolean(MMKVStorageKeys.SEND_METRICS)

	const [sendMetrics, setSendMetrics] = useState(sendMetricsInit ?? false)

	useEffect(() => {
		storage.set(MMKVStorageKeys.SEND_METRICS, sendMetrics)
	}, [sendMetrics])

	return {
		sendMetrics,
		setSendMetrics,
	}
}

export const SettingsContext = createContext<SettingsContext>({
	sendMetrics: false,
	setSendMetrics: () => {},
})

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const context = SettingsContextInitializer()

	return <SettingsContext.Provider value={context}>{children}</SettingsContext.Provider>
}

export const useSettingsContext = () => useContext(SettingsContext)
