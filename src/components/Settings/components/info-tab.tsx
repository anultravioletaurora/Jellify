import { SafeAreaView } from 'react-native-safe-area-context'
import { getToken, ListItem, Progress, Separator, YGroup } from 'tamagui'
import Icon from '../../Global/helpers/icon'
import { version } from '../../../../package.json'
import { Text } from '../../Global/helpers/text'
import { useNetworkContext } from '../../../providers/Network'

export default function InfoTab() {
	const { downloadedTracks, storageUsage } = useNetworkContext()

	return (
		<SafeAreaView>
			<YGroup
				alignSelf='center'
				borderColor={'$borderColor'}
				borderWidth={'$1'}
				borderRadius={'$4'}
				margin={'$4'}
			>
				<YGroup.Item>
					<ListItem
						size={'$5'}
						title={'Storage'}
						subTitle={`${downloadedTracks?.length ?? '0'} ${
							downloadedTracks?.length === 1 ? 'song' : 'songs'
						} in your pocket`}
					>
						<Progress
							borderColor={'$success'}
							size={'$2'}
							value={storageUsage?.storageInUseByJellify ?? 0}
							max={storageUsage?.totalStorage ?? 100}
						>
							<Progress.Indicator />
						</Progress>
					</ListItem>

					<Separator />
					<ListItem
						size={'$5'}
						icon={<Icon name='jellyfish' color={getToken('$color.telemagenta')} />}
						title='Jellify'
						subTitle={version}
					>
						<Text>Made with 💜 by Violet Caulfield</Text>
					</ListItem>
				</YGroup.Item>
			</YGroup>
		</SafeAreaView>
	)
}
