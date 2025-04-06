import { queryClient } from "../../constants/query-client";
import { QueryKeys } from "../../enums/query-keys";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { ListTemplate } from "react-native-carplay";

export default function ListItemTemplate(items: BaseItemDto[] | undefined) : ListTemplate {
    return new ListTemplate({
        sections: [
            {
                items: items?.map(item => {
                    return {
                        id: item.Id!,
                        text: item.Name ?? "Untitled",
                        image: {
                            uri: queryClient.getQueryData<string | undefined>([QueryKeys.ItemImage, item.Id!])
                        }
                    }
                }) ?? []
            }
        ],
        async onItemSelect(e) {
            console.debug("Item selected", e)
        }
    })
}