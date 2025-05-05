import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import React from 'react'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { XStack } from 'tamagui'
import Albums from './albums'
import SimilarArtists from './similar'
import FastImage from 'react-native-fast-image'
import {
	createMaterialTopTabNavigator,
	MaterialTopTabBar,
} from '@react-navigation/material-top-tabs'
import { StackParamList } from '../types'
import { useArtistContext } from './provider'
import { ImageType } from '@jellyfin/sdk/lib/generated-client/models'
import { useJellifyContext } from '../provider'
import FavoriteButton from '../Global/components/favorite-button'
import { H5 } from '../Global/helpers/text'
import InstantMixButton from '../Global/components/instant-mix-button'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTheme } from 'tamagui'
const ArtistTabs = createMaterialTopTabNavigator<StackParamList>()

export default function ArtistNavigation({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { api } = useJellifyContext()
	const { artist, scroll } = useArtistContext()

	const { width } = useSafeAreaFrame()

	const theme = useTheme()

	const bannerHeight = 250

	const animatedBannerStyle = useAnimatedStyle(() => {
		'worklet'
		const clampedScroll = Math.max(0, Math.min(scroll.value, bannerHeight))
		return {
			height: bannerHeight - clampedScroll,
		}
	})

	return (
		<ArtistTabs.Navigator
			tabBar={(props) => (
				<>
					<Animated.View style={[animatedBannerStyle]}>
						<FastImage
							source={{
								uri: getImageApi(api!).getItemImageUrlById(
									artist.Id!,
									ImageType.Backdrop,
								),
							}}
							style={{
								width: width,
								height: '100%',
								backgroundColor: theme.borderColor.val,
							}}
						/>
					</Animated.View>

					<XStack
						marginHorizontal={'$4'}
						marginVertical={'$2'}
						alignContent='center'
						alignItems='center'
						justifyContent='space-between'
					>
						<H5 numberOfLines={2} maxWidth={width / 1.5}>
							{artist.Name}
						</H5>

						<XStack justifyContent='flex-end' gap={'$6'}>
							<FavoriteButton item={artist} />

							<InstantMixButton item={artist} navigation={navigation} />
						</XStack>
					</XStack>
					<MaterialTopTabBar {...props} />
				</>
			)}
		>
			<ArtistTabs.Screen
				name='ArtistAlbums'
				options={{
					title: 'Albums',
				}}
				component={Albums}
			/>

			<ArtistTabs.Screen
				name='ArtistEps'
				options={{
					title: 'Singles & EPs',
				}}
				component={Albums}
			/>
			<ArtistTabs.Screen
				name='SimilarArtists'
				options={{
					title: 'Similar',
				}}
				component={SimilarArtists}
			/>
		</ArtistTabs.Navigator>
	)
}
