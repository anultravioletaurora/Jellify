import { ListItem, View, YGroup } from 'tamagui'
import { Text } from '../../Global/helpers/text'
import { SwitchWithLabel } from '../../Global/helpers/switch-with-label'
import Icon from '../../Global/helpers/icon'

export default function LabsTab(): React.JSX.Element {
	return (
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
					icon={<Icon name='test-tube-off' />}
					title={'Nothing to see here...(yet)'}
					subTitle={'Come back later to enable beta features'}
				/>
			</YGroup.Item>
		</YGroup>
	)
}
