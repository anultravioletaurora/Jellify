import { SafeAreaView } from 'react-native-safe-area-context'
import SettingsListGroup from './settings-list-group'
import { SwitchWithLabel } from '../../Global/helpers/switch-with-label'
import { useSettingsContext } from '../../../providers/Settings'
import { useNetworkContext } from '../../../providers/Network'

export default function StorageTab(): React.JSX.Element {
	const { autoDownload, setAutoDownload } = useSettingsContext()
	const { downloadedTracks, storageUsage } = useNetworkContext()

	return (
		<SafeAreaView>
			<SettingsListGroup
				settingsList={[
					{
						title: 'Usage',
						subTitle: `${downloadedTracks?.length ?? '0'} ${
							downloadedTracks?.length === 1 ? 'song' : 'songs'
						} in your pocket`,
						iconName: 'harddisk',
						iconColor: '$borderColor',
					},
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
