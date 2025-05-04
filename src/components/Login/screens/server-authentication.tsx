import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import _ from 'lodash'
import { JellyfinCredentials } from '../../../api/types/jellyfin-credentials'
import { getToken, Spacer, Spinner, XStack, YStack } from 'tamagui'
import { H2 } from '../../Global/helpers/text'
import Button from '../../Global/helpers/button'
import { SafeAreaView } from 'react-native-safe-area-context'
import { JellifyUser } from '../../../types/JellifyUser'
import { StackParamList } from '../../../components/types'
import Input from '../../../components/Global/helpers/input'
import Icon from '../../../components/Global/helpers/icon'
import { useJellifyContext } from '../../provider'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Toast from 'react-native-toast-message'

export default function ServerAuthentication({
	navigation,
}: {
	navigation: NativeStackNavigationProp<StackParamList>
}): React.JSX.Element {
	const { api } = useJellifyContext()
	const [username, setUsername] = useState<string | undefined>(undefined)
	const [password, setPassword] = React.useState<string | undefined>(undefined)

	const { server, setUser, setServer } = useJellifyContext()

	const useApiMutation = useMutation({
		mutationFn: async (credentials: JellyfinCredentials) => {
			return await api!.authenticateUserByName(credentials.username, credentials.password)
		},
		onSuccess: async (authResult) => {
			console.log(`Received auth response from server`)
			if (_.isUndefined(authResult))
				return Promise.reject(new Error('Authentication result was empty'))

			if (authResult.status >= 400 || _.isEmpty(authResult.data.AccessToken))
				return Promise.reject(new Error('Invalid credentials'))

			if (_.isUndefined(authResult.data.User))
				return Promise.reject(new Error('Unable to login'))

			console.log(`Successfully signed in to server`)

			const user: JellifyUser = {
				id: authResult.data.User!.Id!,
				name: authResult.data.User!.Name!,
				accessToken: authResult.data.AccessToken as string,
			}

			setUser(user)

			navigation.navigate('LibrarySelection')
		},
		onError: async (error: Error) => {
			console.error('An error occurred connecting to the Jellyfin instance', error)

			Toast.show({
				text1: `Unable to sign in to ${server!.name}`,
				type: 'error',
			})
			return Promise.reject(`An error occured signing into ${server!.name}`)
		},
	})

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<YStack maxHeight={'$19'} flex={1} justifyContent='center'>
				<H2 marginHorizontal={'$2'} textAlign='center'>
					{`Sign in to ${server?.name ?? 'Jellyfin'}`}
				</H2>
			</YStack>
			<YStack marginHorizontal={'$2'}>
				<Input
					prependElement={
						<Icon
							small
							name='human-greeting-variant'
							color={getToken('$color.amethyst')}
						/>
					}
					placeholder='Username'
					value={username}
					onChangeText={(value: string | undefined) => setUsername(value)}
					autoCapitalize='none'
					autoCorrect={false}
				/>

				<Spacer />

				<Input
					prependElement={
						<Icon small name='lock-outline' color={getToken('$color.amethyst')} />
					}
					placeholder='Password'
					value={password}
					onChangeText={(value: string | undefined) => setPassword(value)}
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry
				/>

				<Spacer />

				<XStack justifyContent='space-between'>
					<Button
						marginVertical={0}
						icon={() => <Icon name='chevron-left' small />}
						bordered={0}
						onPress={() => {
							if (navigation.canGoBack()) navigation.goBack()
							else
								navigation.navigate('ServerAddress', undefined, {
									pop: false,
								})
						}}
					>
						Switch Server
					</Button>
					{useApiMutation.isPending ? (
						<Spinner />
					) : (
						<Button
							marginVertical={0}
							disabled={_.isEmpty(username) || useApiMutation.isPending}
							onPress={() => {
								if (!_.isUndefined(username)) {
									console.log(`Signing in...`)
									useApiMutation.mutate({ username, password })
								}
							}}
						>
							Sign in
						</Button>
					)}
				</XStack>
				{/* <Toast /> */}
			</YStack>
		</SafeAreaView>
	)
}
