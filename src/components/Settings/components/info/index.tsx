import { SafeAreaView } from 'react-native-safe-area-context'
import { version } from '../../../../../package.json'
import { Text } from '../../../Global/helpers/text'
import SettingsListGroup from '../settings-list-group'
import { InfoTabStackNavigationProp } from './types'

export default function InfoTabIndex({ navigation }: InfoTabStackNavigationProp) {
	return (
		<SafeAreaView>
			<SettingsListGroup
				settingsList={[
					{
						title: `Jellify`,
						subTitle: version,
						iconName: 'jellyfish',
						iconColor: '$borderColor',
						children: <Text>Made with 💜 by Violet Caulfield</Text>,
					},
				]}
			/>
		</SafeAreaView>
	)
}
