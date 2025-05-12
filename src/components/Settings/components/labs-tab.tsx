import { ListItem, View, YGroup } from 'tamagui'
import { Text } from '../../Global/helpers/text'
import { SwitchWithLabel } from '../../Global/helpers/switch-with-label'
import Icon from '../../Global/components/icon'
import SettingsListGroup from './settings-list-group'

export default function LabsTab(): React.JSX.Element {
	return (
		<SettingsListGroup
			borderColor={'$danger'}
			settingsList={[
				{
					title: 'Nothing to see here...(yet)',
					subTitle: 'Come back later to enable experimental features',
					iconName: 'test-tube-off',
					iconColor: '$danger',
				},
			]}
		/>
	)
}
