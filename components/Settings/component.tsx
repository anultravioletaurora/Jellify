import React from 'react'
import { ScrollView } from 'tamagui'
import SignOut from './helpers/sign-out'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { FlatList } from 'react-native'
import IconCard from '../Global/helpers/icon-card'
import Categories from './categories'
import { StorageBar } from '../Storage'
import { AutoDownloadToggle } from '../Network/AutoDownloadToggle'

export default function Root({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { width } = useSafeAreaFrame()

	return (
		<FlatList
			contentInsetAdjustmentBehavior='automatic'
			data={Categories}
			numColumns={2}
			renderItem={({ index, item }) => (
				<IconCard
					name={item.iconName}
					caption={item.name}
					width={width / 2.1}
					onPress={() => {
						navigation.navigate(item.name, item.params)
					}}
					largeIcon
				/>
			)}
			ListFooterComponent={
				<>
					<StorageBar />
					<AutoDownloadToggle />
					<SignOut />
				</>
			}
		/>
	)
}
