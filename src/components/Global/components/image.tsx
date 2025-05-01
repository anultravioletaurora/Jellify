import Client from '../../../api/client'
import { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models'
import { getImageApi } from '@jellyfin/sdk/lib/utils/api'
import { isUndefined } from 'lodash'
import { StyleProp } from 'react-native'
import FastImage, { ImageStyle } from 'react-native-fast-image'
import { FontSizeTokens, getToken, getTokenValue } from 'tamagui'

interface ImageProps {
	item: BaseItemDto
	circular?: boolean | undefined
	width?: FontSizeTokens | undefined
	height?: FontSizeTokens | undefined
	style?: ImageStyle | undefined
}

export default function ItemImage({
	item,
	circular,
	width,
	height,
	style,
}: ImageProps): React.JSX.Element {
	return (
		<FastImage
			source={{ uri: getImageApi(Client.api!).getItemImageUrlById(item.Id!) }}
			style={{
				borderRadius: circular
					? width
						? width
						: getTokenValue('$12') + getToken('$5')
					: getTokenValue('$2'),
				width: !isUndefined(width) ? width : getToken('$12') + getToken('$5'),
				height: !isUndefined(height) ? height : getToken('$12') + getToken('$5'),
				alignSelf: 'center',
				...style,
			}}
		/>
	)
}
