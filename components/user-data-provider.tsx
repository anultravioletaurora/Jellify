import Client from '../api/client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getUserLibraryApi } from '@jellyfin/sdk/lib/utils/api'
import { useMutation } from '@tanstack/react-query'
import { createContext, ReactNode, SetStateAction, useContext } from 'react'

import * as Burnt from 'burnt'
import { trigger } from 'react-native-haptic-feedback'
import { queryClient } from '../constants/query-client'
import { QueryKeys } from '../enums/query-keys'

interface SetFavoriteMutation {
	item: BaseItemDto
	setFavorite: React.Dispatch<SetStateAction<boolean>>
	onToggle?: () => void
}

interface JellifyUserDataContext {
	toggleFavorite: (isFavorite: boolean, mutation: SetFavoriteMutation) => void
}

const JellifyUserDataContextInitializer = () => {
	const useSetFavorite = useMutation({
		mutationFn: async (mutation: SetFavoriteMutation) => {
			return getUserLibraryApi(Client.api!).markFavoriteItem({
				itemId: mutation.item.Id!,
			})
		},
		onSuccess: ({ data }, { item, setFavorite, onToggle }) => {
			Burnt.alert({
				title: `Added favorite`,
				duration: 1,
				preset: 'heart',
			})

			trigger('notificationSuccess')

			setFavorite(true)
			if (onToggle) onToggle()

			// Force refresh of track user data
			queryClient.invalidateQueries({ queryKey: [QueryKeys.UserData, item.Id] })
		},
	})

	const useRemoveFavorite = useMutation({
		mutationFn: async (mutation: SetFavoriteMutation) => {
			return getUserLibraryApi(Client.api!).unmarkFavoriteItem({
				itemId: mutation.item.Id!,
			})
		},
		onSuccess: ({ data }, { item, setFavorite, onToggle }) => {
			Burnt.alert({
				title: `Removed favorite`,
				duration: 1,
				preset: 'done',
			})

			trigger('notificationSuccess')
			setFavorite(false)

			if (onToggle) onToggle()

			// Force refresh of track user data
			queryClient.invalidateQueries({ queryKey: [QueryKeys.UserData, item.Id] })
		},
	})

	const toggleFavorite = (isFavorite: boolean, mutation: SetFavoriteMutation) =>
		(isFavorite ? useRemoveFavorite : useSetFavorite).mutate(mutation)

	return {
		toggleFavorite,
	}
}

const JellifyUserDataContext = createContext<JellifyUserDataContext>({
	toggleFavorite: () => {},
})

export const JellifyUserDataProvider: ({
	children,
}: {
	children: ReactNode
}) => React.JSX.Element = ({ children }: { children: ReactNode }) => {
	const { toggleFavorite } = JellifyUserDataContextInitializer()

	return (
		<JellifyUserDataContext.Provider
			value={{
				toggleFavorite,
			}}
		>
			{children}
		</JellifyUserDataContext.Provider>
	)
}

export const useJellifyUserDataContext = () => useContext(JellifyUserDataContext)
