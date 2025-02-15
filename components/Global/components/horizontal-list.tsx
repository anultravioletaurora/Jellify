import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models/base-item-dto";
import React from "react";
import { FlatList, ListRenderItem } from "react-native";
import { ItemCard } from "./item-card";
import IconCard from "../helpers/icon-card";
import { BaseItemKind } from "@jellyfin/sdk/lib/generated-client/models";
import { horizontalCardLimit } from "../component.config";

interface HorizontalCardListProps {
    items: BaseItemDto[] | undefined;
    renderItem: ListRenderItem<BaseItemDto> | null | undefined

    squared?: boolean | undefined;
    /**
     * The number of items that will be displayed before
     * we cut it off and display a "Show More" card
     */
    cutoff?: number | undefined;
    onSeeMore: () => void;
}

/**
 * Displays a Horizontal FlatList of 20 ItemCards
 * then shows a "See More" button
 * @param param0 
 * @returns 
 */
export default function HorizontalCardList({
    items,
    renderItem,
    cutoff = horizontalCardLimit,
    onSeeMore,
    squared = false,
} : HorizontalCardListProps) : React.JSX.Element {

    return (
        <FlatList
            horizontal
            data={items?.slice(0, cutoff - 1) ?? undefined}
            renderItem={renderItem}
            ListFooterComponent={() => {
                return items ? (
                <IconCard
                    name={
                        squared 
                        ? "arrow-right-box" 
                        : "arrow-right-circle"
                    }
                    circular={!squared}
                    caption="See More"
                    onPress={onSeeMore}
                />
                ) : undefined}
            }
            style={{
                overflow: 'hidden' // Prevent unnecessary memory usage
            }} 
        />
    )
}