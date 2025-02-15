import { JellifyTrack } from "../types/JellifyTrack";
import { QueuingType } from "../enums/queuing-type";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { Queue } from "./types/queue-item";

export interface QueueMutation { 
    track: BaseItemDto;
    index?: number | undefined;
    tracklist: BaseItemDto[];
    queue: Queue;
    queuingType?: QueuingType | undefined;
}

export interface AddToQueueMutation {
    track: BaseItemDto,
    queuingType?: QueuingType | undefined;
}

export interface QueueOrderMutation {
    newOrder: JellifyTrack[];
    from: number;
    to: number;
}