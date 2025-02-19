import { ImageFormat, ImageType } from "@jellyfin/sdk/lib/generated-client/models"
import { getImageApi } from "@jellyfin/sdk/lib/utils/api"
import _ from "lodash"
import Client from "../../../api/client"

export function fetchItemImage(itemId: string, imageType: ImageType) {
    
    return new Promise<string>(async (resolve, reject) => {

        console.debug("Fetching item image");

        if (!!!Client.api) 
            return reject("Client instance not set")
        else
            getImageApi(Client.api!)
                .getItemImage({
                    itemId,
                    imageType,
                    width: 1000, // We just care about one big nice image 
                    height: 1000, // to keep in cache to use for all instants of
                    format: ImageFormat.Png // the image
                },
                {
                    responseType: 'blob',
                })
            .then(async (response) => {

                if (response.status < 300) {

                    return resolve(await blobToBase64(response.data))
                } else {
                    return reject("Invalid image response");
                }
            }).catch((error) => {
                console.error(error);
                reject(error);
            })
    });
}

function blobToBase64(blob : Blob) {
    return new Promise<string>((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }