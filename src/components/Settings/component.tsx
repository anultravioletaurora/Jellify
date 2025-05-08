import React from 'react'
import SignOut from '../../components/Settings/sign-out'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { FlatList } from 'react-native'
import IconCard from '../Global/helpers/icon-card'
import Categories from '../../components/Settings/categories'
import StorageBar from '../Storage'

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
					<SignOut />
				</>
			}
		/>
	)
}
