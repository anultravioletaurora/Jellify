import { MaterialTopTabBar, MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import React, { useEffect } from 'react'
import { Separator, XStack, YStack } from 'tamagui'
import Icon from '../Global/components/icon'
import { useLibrarySortAndFilterContext } from '../../providers/Library/sorting-filtering'
import { Text } from '../Global/helpers/text'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import Animated from 'react-native-reanimated'

export default function LibraryTabBar(props: MaterialTopTabBarProps) {
	useEffect(() => {
		console.debug(`LibraryTabBar:`, props.state.routes[props.state.index].name)
	}, [props])

	const {
		sortDescending,
		setSortDescending,
		isFavorites,
		setIsFavorites,
		isDownloaded,
		setIsDownloaded,
	} = useLibrarySortAndFilterContext()

	return (
		<YStack>
			<MaterialTopTabBar {...props} />

			<XStack
				paddingHorizontal={'$4'}
				paddingVertical={'$3'}
				borderWidth={'$1'}
				borderColor={'$purpleGray'}
				marginTop={'$2'}
				marginHorizontal={'$2'}
				borderRadius={'$4'}
				backgroundColor={'$background'}
				alignItems={'center'}
				justifyContent='flex-end'
			>
				<Animated.View entering={FadeIn} exiting={FadeOut}>
					{props.state.routes[props.state.index].name === 'Playlists' ? (
						<XStack
							flex={1}
							onPress={() => props.navigation.navigate('AddPlaylist')}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<Icon name={'plus-circle-outline'} color={'$primary'} />

							<Text color={'$primary'}>Create Playlist</Text>
						</XStack>
					) : (
						<XStack
							flex={1}
							onPress={() => setIsFavorites(!isFavorites)}
							alignItems={'center'}
							justifyContent={'center'}
						>
							<Icon
								name={isFavorites ? 'heart' : 'heart-outline'}
								color={isFavorites ? '$primary' : '$borderColor'}
							/>

							<Text color={isFavorites ? '$primary' : '$borderColor'}>
								{isFavorites ? 'Favorites' : 'All'}
							</Text>
						</XStack>
					)}
				</Animated.View>

				{props.state.routes[props.state.index].name === 'Tracks' && (
					<XStack
						flex={1}
						onPress={() => setIsDownloaded(!isDownloaded)}
						alignItems={'center'}
						justifyContent={'center'}
					>
						<Icon
							name={isDownloaded ? 'download' : 'download-outline'}
							color={isDownloaded ? '$success' : '$borderColor'}
						/>

						<Text color={isDownloaded ? '$success' : '$borderColor'}>
							{isDownloaded ? 'Downloaded' : 'All'}
						</Text>
					</XStack>
				)}

				<Separator vertical />

				<XStack
					flex={1}
					onPress={() => setSortDescending(!sortDescending)}
					alignItems={'center'}
					justifyContent={'center'}
				>
					<Icon
						name={
							sortDescending
								? 'sort-alphabetical-descending'
								: 'sort-alphabetical-ascending'
						}
						color={sortDescending ? '$success' : '$borderColor'}
					/>

					<Text color={sortDescending ? '$success' : '$borderColor'}>
						{sortDescending ? 'Descending' : 'Ascending'}
					</Text>
				</XStack>
			</XStack>
		</YStack>
	)
}
