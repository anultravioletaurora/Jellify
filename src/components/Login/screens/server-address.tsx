import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { JellifyServer } from '../../../types/JellifyServer'
import { Input, Spinner, YStack } from 'tamagui'
import { SwitchWithLabel } from '../../Global/helpers/switch-with-label'
import { H2 } from '../../Global/helpers/text'
import Button from '../../Global/helpers/button'
import { http, https } from '../utils/constants'
import { JellyfinInfo } from '../../../api/info'
import { Jellyfin } from '@jellyfin/sdk/lib/jellyfin'
import { getSystemApi } from '@jellyfin/sdk/lib/utils/api/system-api'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { StackParamList } from '../../../components/types'
import Toast from 'react-native-toast-message'
import { useJellifyContext } from '../../../providers'

export default function ServerAddress({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const [useHttps, setUseHttps] = useState<boolean>(true)
	const [serverAddress, setServerAddress] = useState<string | undefined>(undefined)

	const { server, setServer, signOut } = useJellifyContext()

	useEffect(() => {
		signOut()
	}, [])

	const useServerMutation = useMutation({
		mutationFn: () => {
			console.debug(`Connecting to ${useHttps ? https : http}${serverAddress}`)

			const jellyfin = new Jellyfin(JellyfinInfo)

			if (!serverAddress) throw new Error('Server address was empty')

			const api = jellyfin.createApi(`${useHttps ? https : http}${serverAddress}`)

			return getSystemApi(api).getPublicSystemInfo()
		},
		onSuccess: (publicSystemInfoResponse) => {
			if (!publicSystemInfoResponse.data.Version)
				throw new Error('Jellyfin instance did not respond')

			console.log(`Connected to Jellyfin ${publicSystemInfoResponse.data.Version!}`)

			const server: JellifyServer = {
				url: `${useHttps ? https : http}${serverAddress!}`,
				address: serverAddress!,
				name: publicSystemInfoResponse.data.ServerName!,
				version: publicSystemInfoResponse.data.Version!,
				startUpComplete: publicSystemInfoResponse.data.StartupWizardCompleted!,
			}

			setServer(server)

			navigation.navigate('ServerAuthentication')
		},
		onError: async (error: Error) => {
			console.error('An error occurred connecting to the Jellyfin instance', error)
			setServer(undefined)

			// Burnt.toast({
			// 	title: 'Unable to connect',
			// 	preset: 'error',
			// 	// message: `Unable to connect to Jellyfin at ${useHttps ? https : http}${serverAddress}`,
			// })
			Toast.show({
				text1: 'Unable to connect',
				text2: `Unable to connect to Jellyfin at ${
					useHttps ? https : http
				}${serverAddress}`,
				type: 'error',
			})
		},
	})

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<YStack maxHeight={'$19'} flex={1} justifyContent='center'>
				<H2 marginHorizontal={'$10'} textAlign='center'>
					Connect to Jellyfin
				</H2>
			</YStack>

			<YStack marginHorizontal={'$2'}>
				<SwitchWithLabel
					checked={useHttps}
					onCheckedChange={(checked) => setUseHttps(checked)}
					label='Use HTTPS'
					size='$2'
					width={100}
				/>

				<Input
					onChangeText={setServerAddress}
					autoCapitalize='none'
					autoCorrect={false}
					placeholder='jellyfin.org'
				/>

				{useServerMutation.isPending ? (
					<Spinner />
				) : (
					<Button
						disabled={_.isEmpty(serverAddress)}
						onPress={() => {
							useServerMutation.mutate()
						}}
					>
						Connect
					</Button>
				)}
			</YStack>
		</SafeAreaView>
	)
}
