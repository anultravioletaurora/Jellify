import React from 'react'
import Button from '../../Global/helpers/button'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SettingsStackParamList } from '../../../screens/Settings/types'
import { Text } from '../../Global/helpers/text'

export default function SignOut({
	navigation,
}: {
	navigation: NativeStackNavigationProp<SettingsStackParamList>
}): React.JSX.Element {
	return (
		<Button
			color={'$danger'}
			borderColor={'$danger'}
			marginHorizontal={'$6'}
			onPress={() => {
				navigation.navigate('SignOut')
			}}
		>
			<Text bold color={'$danger'}>
				Sign Out
			</Text>
		</Button>
	)
}
