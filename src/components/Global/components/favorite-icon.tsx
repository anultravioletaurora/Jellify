import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getToken, Spacer, YStack } from 'tamagui'
import Icon from './icon'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../../enums/query-keys'
import { fetchUserData } from '../../../api/queries/favorites'
import { useEffect, useState } from 'react'
import { useJellifyContext } from '../../../providers'

export default function FavoriteIcon({ item }: { item: BaseItemDto }): React.JSX.Element {
	const [isFavorite, setIsFavorite] = useState<boolean>(item.UserData?.IsFavorite ?? false)
	const { api, user, library } = useJellifyContext()
	const { data: userData } = useQuery({
		queryKey: [QueryKeys.UserData, item.Id!],
		queryFn: () => fetchUserData(api, user, item.Id!),
		staleTime: 1000 * 60 * 5, // 5 minutes,
	})

	useEffect(() => {
		setIsFavorite(userData?.IsFavorite ?? false)
	}, [userData])

	return (
		<YStack alignContent='center' justifyContent='center' minWidth={24}>
			{isFavorite ? <Icon small name='heart' color={'$primary'} /> : <Spacer />}
		</YStack>
	)
}
