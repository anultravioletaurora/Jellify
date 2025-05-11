import { SafeAreaView } from 'react-native-safe-area-context'
import SettingsListGroup from './settings-list-group'
import { View } from 'tamagui'

export default function PlaybackTab(): React.JSX.Element {
	return (
		<SafeAreaView>
			<SettingsListGroup
				settingsList={[
					{
						title: 'Coming soon...',
						subTitle: 'Settings to control playback',
						iconName: 'cassette',
						iconColor: '$borderColor',
					},
				]}
			/>
		</SafeAreaView>
	)
}
