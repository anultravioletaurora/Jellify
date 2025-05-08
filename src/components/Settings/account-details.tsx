import { XStack } from '@tamagui/stacks'
import React from 'react'
import { Text } from '../../components/Global/helpers/text'
import Icon from '../../components/Global/helpers/icon'
import { useJellifyContext } from '../../providers'
export default function AccountDetails(): React.JSX.Element {
	const { user } = useJellifyContext()

	return (
		<XStack alignItems='center'>
			<Icon name='account-music-outline' />
			<Text>{user!.name}</Text>
		</XStack>
	)
}
