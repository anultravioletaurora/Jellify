import Albums from '../../components/Albums/component'
import { RecentlyAddedProps } from '../../components/types'

export default function RecentlyAdded({
	route,
	navigation,
}: RecentlyAddedProps): React.JSX.Element {
	return (
		<Albums
			navigation={navigation}
			albums={route.params.albums}
			fetchNextPage={route.params.fetchNextPage}
			hasNextPage={route.params.hasNextPage}
			isPending={route.params.isPending}
			isFetchingNextPage={route.params.isFetchingNextPage}
			showAlphabeticalSelector={false}
		/>
	)
}
