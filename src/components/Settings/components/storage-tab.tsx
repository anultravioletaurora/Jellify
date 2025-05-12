import { SafeAreaView } from 'react-native-safe-area-context'
import SettingsListGroup from './settings-list-group'
import { SwitchWithLabel } from '../../Global/helpers/switch-with-label'
import { useSettingsContext } from '../../../providers/Settings'

export default function StorageTab(): React.JSX.Element {
	const { autoDownload, setAutoDownload } = useSettingsContext()
	return (
		<SafeAreaView>
			<SettingsListGroup
				settingsList={[
					{
						title: 'Automatically Cache Tracks',
						subTitle: 'Download tracks as they are played',
						iconName: autoDownload ? 'cloud-download' : 'cloud-off-outline',
						iconColor: autoDownload ? '$success' : '$borderColor',
						children: (
							<SwitchWithLabel
								size={'$2'}
								label={autoDownload ? 'Enabled' : 'Disabled'}
								checked={autoDownload}
								onCheckedChange={() => setAutoDownload(!autoDownload)}
							/>
						),
					},
				]}
			/>
		</SafeAreaView>
	)
}
