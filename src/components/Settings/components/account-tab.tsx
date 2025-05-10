import React from 'react'
import Icon from '../../Global/helpers/icon'
import { useJellifyContext } from '../../../providers'
import { ListItem, YGroup } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOut from './sign-out-button'
import { SettingsStackParamList } from '../../../screens/Settings/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { Text } from '../../Global/helpers/text'

export default function AccountTab(): React.JSX.Element {
	const { user, library } = useJellifyContext()

	const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>()

	return (
		<SafeAreaView>
			<YGroup
				alignSelf='center'
				borderColor={'$telemagenta'}
				borderWidth={'$1'}
				borderRadius={'$4'}
				margin={'$4'}
			>
				<YGroup.Item>
					<ListItem
						size={'$5'}
						icon={<Icon name='account-music' />}
						title={'Username'}
						subTitle={"You're awesome!"}
					>
						<Text>{user!.name}</Text>
					</ListItem>
				</YGroup.Item>

				<YGroup.Item>
					<ListItem
						size={'$5'}
						icon={<Icon name='book-music' />}
						title={'Selected Library'}
					>
						<Text>{library!.musicLibraryName!}</Text>
					</ListItem>
				</YGroup.Item>

				<YGroup.Item forcePlacement='last'>
					<SignOut navigation={navigation} />
				</YGroup.Item>
			</YGroup>
		</SafeAreaView>
	)
}
