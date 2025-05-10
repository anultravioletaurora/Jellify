import { YStack } from 'tamagui'

import { XStack, Spacer } from 'tamagui'

import Icon from '../../Global/components/icon'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../../components/types'

export default function Footer({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	return (
		<YStack justifyContent='flex-end'>
			<XStack justifyContent='space-evenly' marginVertical={'$3'}>
				<Icon name='speaker-multiple' />

				<Spacer />

				<Spacer />

				<Spacer />

				<Icon
					name='playlist-music'
					onPress={() => {
						navigation.navigate('Queue')
					}}
				/>
			</XStack>
		</YStack>
	)
}
