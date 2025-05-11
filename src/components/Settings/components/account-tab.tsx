import React from 'react'
import Icon from '../../Global/components/icon'
import { useJellifyContext } from '../../../providers'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignOut from './sign-out-button'
import { SettingsStackParamList } from '../../../screens/Settings/types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { Text } from '../../Global/helpers/text'
import SettingsListGroup from './settings-list-group'

export default function AccountTab(): React.JSX.Element {
	const { user, library, server } = useJellifyContext()

	const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>()

	return (
		<SafeAreaView>
			<SettingsListGroup
				settingsList={[
					{
						title: 'Username',
						subTitle: 'You are awesome!',
						iconName: 'account-music',
						iconColor: '$borderColor',
						children: <Text>{user?.name ?? 'Unknown User'}</Text>,
					},
					{
						title: 'Selected Library',
						subTitle: '',
						iconName: 'book-music',
						iconColor: '$borderColor',
						children: <Text>{library?.musicLibraryName ?? 'Unknown Library'}</Text>,
					},
					{
						title: 'Jellyfin Server',
						subTitle: server?.version ?? 'Unknown Jellyfin Version',
						iconName: 'server',
						iconColor: '$borderColor',
						children: <Text>{server?.name ?? 'Unknown Server'}</Text>,
					},
				]}
			/>
			<SignOut navigation={navigation} />
		</SafeAreaView>
	)
}
