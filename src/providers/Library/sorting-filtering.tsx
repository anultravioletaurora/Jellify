import { storage } from '../../constants/storage'
import { MMKVStorageKeys } from '../../enums/mmkv-storage-keys'
import { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'

interface LibrarySortAndFilterContext {
	sortDescending: boolean
	setSortDescending: (sortDescending: boolean) => void
	isFavorites: boolean
	setIsFavorites: (isFavorites: boolean) => void
}

const LibrarySortAndFilterContextInitializer = () => {
	const sortDescendingInit = storage.getBoolean(MMKVStorageKeys.LibrarySortDescending)
	const isFavoritesInit = storage.getBoolean(MMKVStorageKeys.LibraryIsFavorites)

	const [sortDescending, setSortDescending] = useState(sortDescendingInit ?? false)
	const [isFavorites, setIsFavorites] = useState(isFavoritesInit ?? false)

	useEffect(() => {
		storage.set(MMKVStorageKeys.LibrarySortDescending, sortDescending)
		storage.set(MMKVStorageKeys.LibraryIsFavorites, isFavorites)
	}, [sortDescending, isFavorites])

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
