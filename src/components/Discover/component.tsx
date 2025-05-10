import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'tamagui'
import RecentlyAdded from './helpers/just-added'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import { useDiscoverContext } from '../../providers/Discover'
import { RefreshControl } from 'react-native'

export default function Index({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { refreshing, refresh } = useDiscoverContext()

	return (
		<SafeAreaView edges={['top', 'left', 'right']}>
			<ScrollView
				flexGrow={1}
				contentInsetAdjustmentBehavior='automatic'
				removeClippedSubviews
				paddingBottom={'$15'}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
			>
				<RecentlyAdded navigation={navigation} />
			</ScrollView>
		</SafeAreaView>
	)
}
