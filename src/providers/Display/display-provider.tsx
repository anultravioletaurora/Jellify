import { createContext, useContext, useState } from 'react'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { getTokens } from 'tamagui'

interface DisplayContext {
	numberOfColumns: number

	display: 'grid' | 'list'

	setDisplay: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
}

const DisplayContextInitializer = () => {
	const { width } = useSafeAreaFrame()

	const [numberOfColumns, setNumberOfColumns] = useState<number>(
		Math.floor(width / getTokens().size.$11.val),
	)

	const [display, setDisplay] = useState<'grid' | 'list'>('grid')

	return {
		numberOfColumns,
		display,
		setDisplay,
	}
}

const DisplayContext = createContext<DisplayContext>({
	numberOfColumns: 0,
	display: 'grid',
	setDisplay: () => {},
})

export const DisplayProvider = ({ children }: { children: React.ReactNode }) => {
	const context = DisplayContextInitializer()

	return <DisplayContext.Provider value={context}>{children}</DisplayContext.Provider>
}

export const useDisplayContext = () => useContext(DisplayContext)
