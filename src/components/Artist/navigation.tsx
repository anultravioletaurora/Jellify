import Client from '../../api/client'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import React, { useEffect } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { YStack } from 'tamagui'
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

const ArtistTabs = createMaterialTopTabNavigator<StackParamList>()

export default function ArtistNavigation(): React.JSX.Element {
	const { artist, scroll } = useArtistContext()

	const { width } = useSafeAreaFrame()

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
								uri: getImageApi(Client.api!).getItemImageUrlById(
									artist.Id!,
									ImageType.Backdrop,
								),
							}}
							style={{ width: width, height: '100%' }}
						/>
					</Animated.View>

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
