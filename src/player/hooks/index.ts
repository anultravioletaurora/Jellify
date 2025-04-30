import TrackPlayer, { RatingType } from 'react-native-track-player'
import { CAPABILITIES } from '../constants'

export const useUpdateOptions = async (isFavorite: boolean) => {
	return await TrackPlayer.updateOptions({
		progressUpdateEventInterval: 1,
		capabilities: CAPABILITIES,
		notificationCapabilities: CAPABILITIES,
		compactCapabilities: CAPABILITIES,
		ratingType: RatingType.Heart,
		likeOptions: {
			isActive: isFavorite,
			title: 'Favorite',
		},
		dislikeOptions: {
			isActive: !isFavorite,
			title: 'Unfavorite',
		},
	})
}
