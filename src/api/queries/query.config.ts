import { ImageFormat } from '@jellyfin/sdk/lib/generated-client/models'

const QueryConfig = {
	limits: {
		recents: 50,
		instantMix: 50,
		search: 50, // TODO: make this a paginated search so limits don't even matter
		similar: 20,
	},
	images: {
		height: 300,
		width: 300,
		format: ImageFormat.Jpg,
	},
	banners: {
		fillHeight: 300,
		fillWidth: 1000,
		format: ImageFormat.Jpg,
	},
	logos: {
		fillHeight: 50,
		fillWidth: 300,
		format: ImageFormat.Png,
	},
	playerArtwork: {
		height: 1000,
		width: 1000,
		format: ImageFormat.Jpg,
	},
	staleTime: {
		oneDay: 1000 * 60 * 60 * 24, // 1 Day
		oneWeek: 1000 * 60 * 60 * 24 * 7, // 7 Days
		oneFortnight: 1000 * 60 * 60 * 24 * 7 * 14, // 14 Days
	},
}

export default QueryConfig
