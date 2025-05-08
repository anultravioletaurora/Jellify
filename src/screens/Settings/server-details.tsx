import React from 'react'
import { YStack, XStack } from 'tamagui'
import { H5, Text } from '../../components/Global/helpers/text'
import Icon from '../../components/Global/helpers/icon'
import { useJellifyContext } from '../../providers'
export default function ServerDetails(): React.JSX.Element {
	const { api, library } = useJellifyContext()
	return (
		<YStack>
			{api && (
				<YStack>
					<H5>Access Token</H5>
					<XStack>
						<Icon name='hand-coin-outline' />
						<Text>{api.accessToken}</Text>
					</XStack>
					<H5>Jellyfin Server</H5>
					<XStack>
						<Icon name='server-network' />
						<Text>{api.basePath}</Text>
					</XStack>
				</YStack>
			)}
			{library && (
				<YStack>
					<H5>Library</H5>
					<XStack>
						<Icon name='book-outline' />
						<Text>{library.musicLibraryName!}</Text>
					</XStack>
				</YStack>
			)}
		</YStack>
	)
}
