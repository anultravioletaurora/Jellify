import React from 'react'
import { getToken, getTokens, useTheme, View, XStack, YStack } from 'tamagui'
import { usePlayerContext } from '../../player/player-provider'
import { BottomTabNavigationEventMap } from '@react-navigation/bottom-tabs'
import { NavigationHelpers, ParamListBase } from '@react-navigation/native'
import Icon from '../Global/helpers/icon'
import { Text } from '../Global/helpers/text'
import TextTicker from 'react-native-text-ticker'
import PlayPauseButton from './helpers/buttons'
import { TextTickerConfig } from './component.config'
import { Image } from 'expo-image'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import Client from '../../api/client'
import { useQueueContext } from '../../player/queue-provider'

export function Miniplayer({
	navigation,
}: {
	navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
}): React.JSX.Element {
	const theme = useTheme()

	const { nowPlaying } = usePlayerContext()
	const { useSkip } = useQueueContext()

	return (
		<View
			style={{
				backgroundColor: theme.background.val,
				borderColor: theme.borderColor.val,
			}}
		>
			{nowPlaying && (
				<XStack
					alignItems='center'
					margin={0}
					padding={0}
					height={'$6'}
					onPress={() => navigation.navigate('Player')}
				>
					<YStack
						justify='center'
						alignItems='flex-start'
						minHeight={'$12'}
						marginLeft={'$2'}
					>
						<Image
							source={getImageApi(Client.api!).getItemImageUrlById(
								nowPlaying!.item.AlbumId!,
							)}
							placeholder={
								nowPlaying &&
								nowPlaying.item.ImageBlurHashes &&
								nowPlaying.item.ImageBlurHashes.Primary
									? nowPlaying.item.ImageBlurHashes.Primary[0]
									: undefined
							}
							style={{
								width: getToken('$12'),
								height: getToken('$12'),
								borderRadius: getToken('$2'),
								backgroundColor: getToken('$color.amethyst'),
								shadowRadius: getToken('$2'),
								shadowOffset: {
									width: 0,
									height: -getToken('$2'),
								},
							}}
						/>
					</YStack>

					<YStack alignContent='flex-start' marginLeft={'$2'} flex={5}>
						<TextTicker {...TextTickerConfig}>
							<Text bold>{nowPlaying?.title ?? 'Nothing Playing'}</Text>
						</TextTicker>

						<TextTicker {...TextTickerConfig}>
							<Text color={getTokens().color.telemagenta}>
								{nowPlaying?.artist ?? ''}
							</Text>
						</TextTicker>
					</YStack>

					<XStack justifyContent='flex-end' flex={2}>
						<PlayPauseButton />

						<Icon
							large
							color={theme.borderColor.val}
							name='skip-next'
							onPress={() => useSkip.mutate(undefined)}
						/>
					</XStack>
				</XStack>
			)}
		</View>
	)
}
