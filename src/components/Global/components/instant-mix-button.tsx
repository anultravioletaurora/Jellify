import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import React from 'react'
import { StackParamList } from '../../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { QueryKeys } from '../../../enums/query-keys'
import { useQuery } from '@tanstack/react-query'
import { fetchInstantMixFromItem } from '../../../api/queries/instant-mixes'
import Icon from '../helpers/icon'
import { getToken, Spacer, Spinner } from 'tamagui'
import { useColorScheme } from 'react-native'

export default function InstantMixButton({
	item,
	navigation,
}: {
	item: BaseItemDto
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { data, isFetching, refetch } = useQuery({
		queryKey: [QueryKeys.InstantMix, item.Id!],
		queryFn: () => fetchInstantMixFromItem(item),
	})

	const isDarkMode = useColorScheme() === 'dark'
	return data ? (
		<Icon
			name='compass-outline'
			color={isDarkMode ? getToken('$color.success') : getToken('$color.grape')}
			onPress={() =>
				navigation.navigate('InstantMix', {
					item,
					mix: data,
				})
			}
		/>
	) : (
		<Spacer />
	)
}
