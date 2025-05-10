import { ListItem, Switch, YGroup } from 'tamagui'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from '../../Global/helpers/icon'
import { useSettingsContext } from '../../../providers/Settings'
import { SwitchWithLabel } from '../../Global/helpers/switch-with-label'

export default function AppTab(): React.JSX.Element {
	const { setSendMetrics, sendMetrics } = useSettingsContext()
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
						icon={<Icon name={sendMetrics ? 'bug-check' : 'bug'} />}
						title={'Send Metrics and Crash Reports'}
						subTitle={'Send anonymous usage and crash data'}
					>
						<SwitchWithLabel
							checked={sendMetrics}
							onCheckedChange={setSendMetrics}
							size={'$2'}
							label={sendMetrics ? 'Enabled' : 'Disabled'}
						/>
					</ListItem>
				</YGroup.Item>
			</YGroup>
		</SafeAreaView>
	)
}
