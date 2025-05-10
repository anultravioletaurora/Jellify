import { TracksProps } from '../../components/types'
import Tracks from '../../components/Tracks/component'

export default function TracksScreen({ route, navigation }: TracksProps): React.JSX.Element {
	return (
		<Tracks
			navigation={navigation}
			tracks={route.params.tracks}
			queue={route.params.queue}
			fetchNextPage={route.params.fetchNextPage}
			hasNextPage={route.params.hasNextPage}
		/>
	)
}
