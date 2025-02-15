import Client from "../../../api/client";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api";
import { isEmpty } from "lodash";

export async function fetchItem(itemId: string) : Promise<BaseItemDto> {
    return new Promise((resolve, reject) => {

        if (isEmpty(itemId))
            reject("No item ID proviced")
        
        getItemsApi(Client.api!)
            .getItems({
                ids: [
                    itemId
                ]
            })
            .then((response) => {
                if (response.data.Items && response.data.TotalRecordCount == 1)
                    resolve(response.data.Items[0])
                else
                    reject(`${response.data.TotalRecordCount} items returned for ID`);
            })
    });
}