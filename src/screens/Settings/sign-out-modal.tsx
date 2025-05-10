import TrackPlayer from 'react-native-track-player'
import { Button, Spacer, View, XStack, YStack } from 'tamagui'
import { SignOutModalProps } from './types'
import { H5, Text } from '../../components/Global/helpers/text'
export default function SignOutModal({ navigation }: SignOutModalProps): React.JSX.Element {
	return (
		<YStack marginHorizontal={'$6'}>
			<H5>Sign out?</H5>

			<Spacer />
			<XStack gap={'$2'}>
				<Button
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
