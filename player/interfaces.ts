import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";

export interface QueueMutation { 
    track: BaseItemDto;
    index: number;
    tracklist: BaseItemDto[];
    queueName: string;
}