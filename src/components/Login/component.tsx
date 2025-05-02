import _, { isUndefined } from 'lodash'
import ServerAuthentication from './screens/server-authentication'
import ServerAddress from './screens/server-address'
import { createStackNavigator } from '@react-navigation/stack'
import ServerLibrary from './screens/server-library'
import { useJellifyContext } from '../provider'

const LoginStack = createStackNavigator()

/**
 * The login screen.
 * @returns The login screen.
 */
export default function Login(): React.JSX.Element {
	const { user, server } = useJellifyContext()

	return (
		<LoginStack.Navigator
			initialRouteName={
				isUndefined(server)
					? 'ServerAddress'
					: isUndefined(user)
						? 'ServerAuthentication'
						: 'LibrarySelection'
			}
			screenOptions={{ headerShown: false }}
		>
			<LoginStack.Screen
				name='ServerAddress'
				options={{
					headerShown: false,
				}}
				component={ServerAddress}
			/>

			<LoginStack.Screen
				name='ServerAuthentication'
				options={{
					headerShown: false,
				}}
				component={ServerAuthentication}
			/>
			<LoginStack.Screen
				name='LibrarySelection'
				options={{
					headerShown: false,
				}}
				component={ServerLibrary}
			/>
		</LoginStack.Navigator>
	)
}
