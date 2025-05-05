import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import Index from './component'
import DetailsScreen from '../ItemDetail/screen'
import Player from '../Player/stack'
import Albums from '../Albums/component'
import { AlbumScreen } from '../Album'
import { ArtistScreen } from '../Artist'
import { DiscoverProvider } from './provider'
import InstantMix from '../InstantMix/component'
import { useTheme } from 'tamagui'

export const DiscoverStack = createNativeStackNavigator<StackParamList>()

export function Discover(): React.JSX.Element {
	const theme = useTheme()

	return (
		<DiscoverProvider>
			<DiscoverStack.Navigator initialRouteName='Discover' screenOptions={{}}>
				<DiscoverStack.Screen
					name='Discover'
					component={Index}
					options={{
						headerLargeTitle: true,
						headerLargeTitleStyle: {
							fontFamily: 'Aileron-Bold',
						},
					}}
				/>

				<DiscoverStack.Screen
					name='Artist'
					component={ArtistScreen}
					options={({ route }) => ({
						title: route.params.artist.Name ?? 'Unknown Artist',
						headerTitleStyle: {
							color: theme.background.val,
						},
					})}
				/>

				<DiscoverStack.Screen
					name='Album'
					component={AlbumScreen}
					options={({ route }) => ({
						title: route.params.album.Name ?? 'Untitled Album',
						headerTitleStyle: {
							color: theme.background.val,
						},
					})}
				/>

				<DiscoverStack.Screen name='Albums' component={Albums} />

				<DiscoverStack.Screen
					name='InstantMix'
					component={InstantMix}
					options={({ route }) => ({
						title: route.params.item.Name
							? `${route.params.item.Name} Mix`
							: 'Instant Mix',
					})}
				/>

				<DiscoverStack.Group screenOptions={{ presentation: 'modal' }}>
					<DiscoverStack.Screen
						name='Details'
						component={DetailsScreen}
						options={{
							headerShown: false,
						}}
					/>
				</DiscoverStack.Group>
			</DiscoverStack.Navigator>
		</DiscoverProvider>
	)
}
