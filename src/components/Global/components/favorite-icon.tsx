import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getToken, Spacer, YStack } from 'tamagui'
import Icon from '../helpers/icon'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../../enums/query-keys'
import { fetchUserData } from '../../../api/queries/favorites'
import { useEffect, useState } from 'react'

export default function FavoriteIcon({ item }: { item: BaseItemDto }): React.JSX.Element {
	const [isFavorite, setIsFavorite] = useState<boolean>(item.UserData?.IsFavorite ?? false)

	const { data: userData } = useQuery({
		queryKey: [QueryKeys.UserData, item.Id!],
		queryFn: () => fetchUserData(item.Id!),
		staleTime: 1000 * 60 * 5, // 5 minutes,
	})

	useEffect(() => {
		setIsFavorite(userData?.IsFavorite ?? false)
	}, [userData])

	return (
		<YStack alignContent='center' justifyContent='center' minWidth={24}>
			{isFavorite ? (
				<Icon small name='heart' color={getToken('$color.telemagenta')} />
			) : (
				<Spacer />
			)}
		</YStack>
	)
}
