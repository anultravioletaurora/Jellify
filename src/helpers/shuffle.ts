import { JellifyTrack } from '../types/JellifyTrack'

export const PLAY_AFTER_SHUFFLE = 1

export const JellifyShuffle = (tracks: JellifyTrack[]): JellifyTrack[] => {
	const shuffled = tracks.map((track, index) => ({
		...track,
		_originalIndex: index,
	}))

	// Fisher-Yates shuffle
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
	}

	return shuffled
}
