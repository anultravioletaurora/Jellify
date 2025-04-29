import NetInfo from '@react-native-community/netinfo'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { getTokenValue, YStack } from 'tamagui'
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	Easing,
	runOnJS,
} from 'react-native-reanimated'

import { QueryKeys } from '../../enums/query-keys'
import { Text } from '../Global/helpers/text'
import { useNetworkContext } from './provider'

const internetConnectionWatcher = {
	NO_INTERNET: 'You are offline',
	BACK_ONLINE: "And we're back!",
}

export enum networkStatusTypes {
	ONLINE = 'ONLINE',
	DISCONNECTED = 'DISCONNECTED',
}

const isAndroid = Platform.OS === 'android'

const InternetConnectionWatcher = () => {
	const { networkStatus, setNetworkStatus } = useNetworkContext()
	const lastNetworkStatus = useRef<keyof typeof networkStatusTypes | null>()
	const queryClient = useQueryClient()

	const bannerHeight = useSharedValue(0)
	const opacity = useSharedValue(0)

	const animateBannerIn = () => {
		bannerHeight.value = withTiming(getTokenValue('$8'), {
			duration: 300,
			easing: Easing.out(Easing.ease),
		})
		opacity.value = withTiming(1, { duration: 300 })
	}

	const animateBannerOut = () => {
		bannerHeight.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
		opacity.value = withTiming(0, { duration: 200 })
	}

	const animatedStyle = useAnimatedStyle(() => {
		return {
			height: bannerHeight.value,
			opacity: opacity.value,
		}
	})

	const changeNetworkStatus = () => {
		if (lastNetworkStatus.current !== networkStatusTypes.DISCONNECTED) {
			setNetworkStatus(null)
		}
	}

	const internetConnectionBack = () => {
		setNetworkStatus(networkStatusTypes.ONLINE)
		setTimeout(() => {
			runOnJS(changeNetworkStatus)() // hide text after 3s
		}, 3000)
	}

	useEffect(() => {
		lastNetworkStatus.current = networkStatus
	}, [networkStatus])

	useEffect(() => {
		if (networkStatus) {
			queryClient.setQueryData([QueryKeys.NetworkStatus], networkStatus)
		}

		if (networkStatus === networkStatusTypes.DISCONNECTED) {
			animateBannerIn()
		} else if (networkStatus === networkStatusTypes.ONLINE) {
			animateBannerIn()
			setTimeout(() => {
				animateBannerOut()
			}, 2800)
		} else if (networkStatus === null) {
			animateBannerOut()
		}
	}, [networkStatus])

	useEffect(() => {
		const networkWatcherListener = NetInfo.addEventListener(
			({ isConnected, isInternetReachable }) => {
				const isNetworkDisconnected = !(
					isConnected && (isAndroid ? isInternetReachable : true)
				)

				if (isNetworkDisconnected) {
					setNetworkStatus(networkStatusTypes.DISCONNECTED)
				} else if (
					!isNetworkDisconnected &&
					lastNetworkStatus.current === networkStatusTypes.DISCONNECTED
				) {
					internetConnectionBack()
				}
			},
		)
		return () => {
			networkWatcherListener()
		}
	}, [])

	return (
		<Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
			<YStack
				height={'$1.5'}
				justifyContent='center'
				alignContent='center'
				backgroundColor={
					networkStatus === networkStatusTypes.ONLINE ? '$success' : '$danger'
				}
			>
				<Text textAlign='center' color='$purpleDark'>
					{networkStatus === networkStatusTypes.ONLINE
						? internetConnectionWatcher.BACK_ONLINE
						: internetConnectionWatcher.NO_INTERNET}
				</Text>
			</YStack>
		</Animated.View>
	)
}

export default InternetConnectionWatcher
