import { JellifyTrack } from '../types/JellifyTrack'
import { QueuingType } from '../enums/queuing-type'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { Queue } from './types/queue-item'

/**
 * A mutation to handle loading a new queue.
 */
export interface QueueMutation {
	/**
	 * The track that will be played first in the queue.
	 */
	track: BaseItemDto
	/**
	 * The index in the queue of the initially played track.
	 */
	index?: number | undefined
	/**
	 * The list of tracks to load into the queue.
	 */
	tracklist: BaseItemDto[]
	/**
	 * The {@link Queue} that this tracklist represents, be it
	 * an album or playlist (represented as a {@link BaseItemDto}),
	 * or a specific queue type (represented by a string)
	 */
	queue: Queue
	/**
	 * The type of queuing to use, dictates the placement of tracks in the queue.
	 */
	queuingType?: QueuingType | undefined
}

/**
 * A mutation to handle adding a track to the queue.
 */
export interface AddToQueueMutation {
	/**
	 * The track to add to the queue.
	 */
	track: BaseItemDto
	/**
	 * The type of queuing to use, dictates the placement of the track in the queue,
	 * be it playing next, or playing in the queue later
	 */
	queuingType?: QueuingType | undefined
}

/**
 * A mutation to handle reordering the queue.
 */
export interface QueueOrderMutation {
	/**
	 * The new order of the queue.
	 *
	 * btw, New Order is fantastic if you like Britpop
	 * {@link https://www.youtube.com/watch?v=c1GxjzHm5us}
	 *
	 * I took every opportunity to use that reference in this project
	 */
	newOrder: JellifyTrack[]
	/**
	 * The index the track is moving from
	 */
	from: number
	/**
	 * The index the track is moving to
	 */
	to: number
}
