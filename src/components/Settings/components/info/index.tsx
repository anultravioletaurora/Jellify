import { SafeAreaView } from 'react-native-safe-area-context'
import { version } from '../../../../../package.json'
import { Text } from '../../../Global/helpers/text'
import SettingsListGroup from '../settings-list-group'
import { InfoTabStackNavigationProp } from './types'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../../../enums/query-keys'
import { useJellifyContext } from '../../../../providers'
import fetchPatrons from '../../../../api/queries/patrons'
import { FlatList } from 'react-native'

export default function InfoTabIndex({ navigation }: InfoTabStackNavigationProp) {
	const { api } = useJellifyContext()

	const { data: patrons } = useQuery({
		queryKey: [QueryKeys.Patrons],
		queryFn: () => fetchPatrons(api),
	})

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
					{
						title: 'Sponsored by listeners like you',
						subTitle:
							patrons && patrons.length > 1
								? `${patrons.length.toString()} patrons`
								: patrons?.length === 1
									? '1 patron'
									: '0 patrons',
						iconName: 'heart',
						iconColor: '$primary',
						children: (
							<FlatList
								data={patrons}
								numColumns={2}
								renderItem={({ item }) => <Text>{item.fullName}</Text>}
							/>
						),
					},
				]}
			/>
		</SafeAreaView>
	)
}
