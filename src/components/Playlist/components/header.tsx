import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../types'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { getToken, getTokens, Spacer, XStack, YStack } from 'tamagui'
import { H5 } from '../../Global/helpers/text'
import InstantMixButton from '../../Global/components/instant-mix-button'
import Icon from '../../Global/helpers/icon'
import { usePlaylistContext } from '../provider'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import FastImage from 'react-native-fast-image'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import { useJellifyContext } from '../../provider'
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models'

export default function PlayliistTracklistHeader(
	playlist: BaseItemDto,
	navigation: NativeStackNavigationProp<StackParamList>,
	editing: boolean,
): React.JSX.Element {
	const { api } = useJellifyContext()

	const { width } = useSafeAreaFrame()

	const { setEditing, scroll } = usePlaylistContext()

	const artworkSize = 100

	const animatedArtworkStyle = useAnimatedStyle(() => {
		'worklet'
		console.debug(scroll.value)
		const clampedScroll = Math.max(0, Math.min(scroll.value, artworkSize))
		return {
			height: artworkSize - clampedScroll,
			width: artworkSize - clampedScroll,
		}
	})

	return (
		<YStack margin={'$4'} alignItems='center'>
			<XStack justifyContent='center'>
				<Animated.View style={[animatedArtworkStyle]}>
					<FastImage
						source={{
							uri: getImageApi(api!).getItemImageUrlById(
								playlist.Id!,
								ImageType.Primary,
							),
						}}
						style={{ width: '100%', height: '100%' }}
					/>
				</Animated.View>

				<Spacer />

				<YStack alignContent='center' justifyContent='center'>
					<H5
						lineBreakStrategyIOS='standard'
						textAlign='center'
						numberOfLines={5}
						minWidth={width / 2.75}
						maxWidth={width / 2.25}
					>
						{playlist.Name ?? 'Untitled Playlist'}
					</H5>

					<XStack justifyContent='center' marginVertical={'$2'}>
						<XStack justifyContent='space-between'>
							{editing && (
								<Icon
									color={getToken('$color.danger')}
									name='delete-sweep-outline' // otherwise use "delete-circle"
									onPress={() =>
										navigation.navigate('DeletePlaylist', { playlist })
									}
								/>
							)}

							<Spacer />

							<Icon
								color={getToken('$color.amethyst')}
								name={editing ? 'content-save-outline' : 'pencil'}
								onPress={() => setEditing(!editing)}
							/>
						</XStack>
						<Spacer />

						<InstantMixButton item={playlist} navigation={navigation} />
					</XStack>
				</YStack>
			</XStack>
		</YStack>
	)
}
