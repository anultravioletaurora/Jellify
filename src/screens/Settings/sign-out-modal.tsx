import TrackPlayer from 'react-native-track-player'
import { Spacer, View, XStack, YStack } from 'tamagui'
import { SignOutModalProps } from './types'
import { H5, Text } from '../../components/Global/helpers/text'
import Button from '../../components/Global/helpers/button'
import Icon from '../../components/Global/components/icon'
import { useJellifyContext } from '../../providers'

export default function SignOutModal({ navigation }: SignOutModalProps): React.JSX.Element {
	const { server } = useJellifyContext()

	return (
		<YStack margin={'$6'}>
			<H5>{`Sign out of ${server?.name ?? 'Jellyfin'}?`}</H5>
			<XStack gap={'$2'}>
				<Button
					icon={() => <Icon name='chevron-left' small color={'$borderColor'} />}
					borderWidth={'$1'}
					borderColor={'$borderColor'}
					flex={1}
					onPress={() => {
						navigation.goBack()
					}}
				>
					<Text bold color={'$borderColor'}>
						Cancel
					</Text>
				</Button>
				<Button
					flex={1}
					icon={() => <Icon name='logout' small color={'$danger'} />}
					color={'$danger'}
					borderColor={'$danger'}
					onPress={() => {
						TrackPlayer.reset()
							.then(() => {
								console.debug('TrackPlayer cleared')
							})
							.catch((error) => {
								console.error('Error clearing TrackPlayer', error)
							})
							.finally(() => {
								navigation.reset({
									index: 0,
									routes: [
										{
											name: 'Login',
											params: {
												screen: 'ServerAddress',
											},
										},
									],
								})
							})
					}}
				>
					<Text bold color={'$danger'}>
						Sign out
					</Text>
				</Button>
			</XStack>
		</YStack>
	)
}
