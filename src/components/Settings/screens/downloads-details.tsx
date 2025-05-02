import React, { useState, useEffect } from 'react'
import { MMKV } from 'react-native-mmkv'
import { YStack, XStack } from 'tamagui'
import { H5, Text } from '../../Global/helpers/text'
import Icon from '../../Global/helpers/icon'
import { Pressable } from 'react-native'

const mmkv = new MMKV({ id: 'settings' })
const QUALITY_KEY = 'downloadQuality'
const qualities = [
	{ label: 'Low (96kbps)', value: '96' },
	{ label: 'Medium (192kbps)', value: '192' },
	{ label: 'High (320kbps)', value: '320' },
	{ label: 'Original', value: 'original' },
]

export default function DownloadsDetails(): React.JSX.Element {
	const [selected, setSelected] = useState('192')

	useEffect(() => {
		const stored = mmkv.getString(QUALITY_KEY)
		if (stored) setSelected(stored)
	}, [])

	const onSelect = (value: string) => {
		setSelected(value)
		mmkv.set(QUALITY_KEY, value)
	}

	return (
		<YStack padding='$4'>
			<H5>Download Quality</H5>
			{qualities.map((q) => (
				<Pressable key={q.value} onPress={() => onSelect(q.value)}>
					<XStack alignItems='center' paddingVertical='$2'>
						<Icon
							name={selected === q.value ? 'radiobox-marked' : 'radiobox-blank'}
							small
						/>
						<Text marginLeft='$2'>{q.label}</Text>
					</XStack>
				</Pressable>
			))}
			<Text color='$colorGray' marginTop='$3' fontSize='$2'>
				Lower quality saves space. &quot;Original&quot; downloads the untranscoded file.
			</Text>
		</YStack>
	)
}
