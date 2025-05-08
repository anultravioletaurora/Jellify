import _ from 'lodash'
import { HomeProvider } from '../../providers/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StackParamList } from '../../components/types'
import { AlbumScreen } from '../../components/Album'
import { PlaylistScreen } from '../Playlist'
import { ProvidedHome } from '../../components/Home'
import DetailsScreen from '../Detail'
import { ArtistScreen } from '../Artist'
import InstantMix from '../../components/InstantMix/component'
import { useTheme } from 'tamagui'
import TracksScreen from '../Tracks'
import HomeArtistsScreen from './artists'

const Stack = createNativeStackNavigator<StackParamList>()

export default function Home(): React.JSX.Element {
	const theme = useTheme()

	return (
		<HomeProvider>
			<Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: true }}>
				<Stack.Group>
					<Stack.Screen
						name='Home'
						component={ProvidedHome}
						options={{
							headerShown: false,
						}}
					/>

					<Stack.Screen
						name='Artist'
						component={ArtistScreen}
						options={({ route }) => ({
							title: route.params.artist.Name ?? 'Unknown Artist',
							headerTitleStyle: {
								color: theme.background.val,
							},
						})}
					/>

					<Stack.Screen
						name='RecentArtists'
						component={HomeArtistsScreen}
						options={{ title: 'Recent Artists' }}
					/>
					<Stack.Screen
						name='MostPlayedArtists'
						component={HomeArtistsScreen}
						options={{ title: 'Most Played' }}
					/>

					<Stack.Screen
						name='Tracks'
						component={TracksScreen}
						options={({ route }) => {
							return {
								title: route.params.queue.valueOf() as string,
							}
						}}
					/>

					<Stack.Screen
						name='Album'
						component={AlbumScreen}
						options={({ route }) => ({
							title: route.params.album.Name ?? 'Untitled Album',
							headerTitleStyle: {
								color: theme.background.val,
							},
						})}
					/>

					<Stack.Screen
						name='Playlist'
						component={PlaylistScreen}
						options={({ route }) => ({
							headerShown: true,
							headerTitleStyle: {
								color: theme.background.val,
							},
						})}
					/>

					<Stack.Screen
						name='InstantMix'
						component={InstantMix}
						options={({ route }) => ({
							title: route.params.item.Name
								? `${route.params.item.Name} Mix`
								: 'Instant Mix',
						})}
					/>
				</Stack.Group>

				<Stack.Group screenOptions={{ presentation: 'modal' }}>
					<Stack.Screen
						name='Details'
						component={DetailsScreen}
						options={{
							headerShown: false,
						}}
					/>
				</Stack.Group>
			</Stack.Navigator>
		</HomeProvider>
	)
}
