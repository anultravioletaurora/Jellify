import { useContext, useState } from 'react'
import { createContext } from 'react'

interface LibrarySortAndFilterContext {
	sortDescending: boolean
	setSortDescending: (sortDescending: boolean) => void
	isFavorites: boolean
	setIsFavorites: (isFavorites: boolean) => void
}

const LibrarySortAndFilterContextInitializer = () => {
	const [sortDescending, setSortDescending] = useState(false)
	const [isFavorites, setIsFavorites] = useState(false)

	return {
		sortDescending,
		setSortDescending,
		isFavorites,
		setIsFavorites,
	}
}
const LibrarySortAndFilterContext = createContext<LibrarySortAndFilterContext>({
	sortDescending: false,
	setSortDescending: () => {},
	isFavorites: false,
	setIsFavorites: () => {},
})

export const LibrarySortAndFilterProvider = ({ children }: { children: React.ReactNode }) => {
	const context = LibrarySortAndFilterContextInitializer()

	return (
		<LibrarySortAndFilterContext.Provider value={context}>
			{children}
		</LibrarySortAndFilterContext.Provider>
	)
}

export const useLibrarySortAndFilterContext = () => useContext(LibrarySortAndFilterContext)
