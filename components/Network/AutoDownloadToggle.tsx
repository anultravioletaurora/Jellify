import React, { useEffect, useState } from 'react'
import { YStack, XStack, Text, Switch, Input, Label } from 'tamagui'
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated'
import { getAudioCacheLimit, setAudioCacheLimit } from './offlineModeUtils'

export function AutoDownloadToggle() {
	// State
	const [autoDownload, setAutoDownload] = useState(false)
	const [downloadCount, setDownloadCount] = useState(1)
	const bgColor = autoDownload ? '#C0476F' : '#222033'

	// For animated toggle bg (optional)
	const animated = useSharedValue(autoDownload ? 1 : 0)
	const animatedStyle = useAnimatedStyle(
		() => ({
			backgroundColor: animated.value ? withSpring('#C0476F') : withSpring('#222033'),
		}),
		[autoDownload],
	)

	// Handle toggle
	const onToggle = (val: boolean) => {
		setAutoDownload(val)
		animated.value = val ? 1 : 0
		if (!val) {
			setAudioCacheLimit(0)
		}
		// call your handler here
	}

	const onDownloadCountChange = (val: string) => {
		const num = Number(val)
		const count = isNaN(num) ? 0 : num
		setDownloadCount(count)
		setAudioCacheLimit(count)
	}

	useEffect(() => {
		setDownloadCount(getAudioCacheLimit() as number)
		setAutoDownload(!!getAudioCacheLimit())
	}, [])
	return (
		<YStack
			bg='#1c1c2e'
			p='$4'
			width='100%'
			maxWidth={420}
			alignSelf='center'
			shadowColor='#C0476F'
			shadowOpacity={0.18}
			shadowRadius={18}
		>
			<XStack alignItems='center' mb='$3' gap='$2'>
				<Text fontWeight='700' color='#fff' fontSize={18}>
					Auto Downloads
				</Text>
				<Switch
					size='$4'
					checked={autoDownload}
					onCheckedChange={onToggle}
					backgroundColor={autoDownload ? '#C0476F' : '#44405A'}
					borderColor='#C0476F'
					borderWidth={2}
					style={{ elevation: 3 }}
				>
					<Switch.Thumb animation='quick' />
				</Switch>
			</XStack>

			<Text color='#BFB3CC' fontSize={15} mb='$2'>
				Automatically download new items for offline use.
			</Text>

			{autoDownload && (
				<XStack alignItems='center' gap='$2' mt='$2'>
					<Label color='#E79AC4' htmlFor='downloadCount' fontWeight='700'>
						Max at once:
					</Label>
					<Input
						id='downloadCount'
						value={downloadCount.toString()}
						width={70}
						onChangeText={onDownloadCountChange}
						bg='#33263D'
						color='#fff'
						borderColor='#C0476F'
						borderWidth={2}
						px='$2'
						py='$1'
						fontSize={16}
					/>
				</XStack>
			)}
		</YStack>
	)
}
