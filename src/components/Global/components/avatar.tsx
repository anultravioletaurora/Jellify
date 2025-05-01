import type { AvatarProps as TamaguiAvatarProps } from 'tamagui'
import { Avatar as TamaguiAvatar, YStack } from 'tamagui'
import { Text } from '../helpers/text'
import { BaseItemDto, ImageType } from '@jellyfin/sdk/lib/generated-client/models'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '../../../enums/query-keys'
import { fetchItemImage } from '../../../api/queries/images'

interface AvatarProps extends TamaguiAvatarProps {
	item: BaseItemDto
	imageType?: ImageType
	subheading?: string | null | undefined
}

export default function Avatar({
	item,
	imageType,
	subheading,
	...props
}: AvatarProps): React.JSX.Element {
	const { data } = useQuery({
		queryKey: [
			QueryKeys.ItemImage,
			item.Id!,
			imageType,
			Math.ceil(150 / 100) * 100, // Images are fetched at a higher, generic resolution
			Math.ceil(150 / 100) * 100, // So these keys need to match
		],
		queryFn: () => fetchItemImage(item.Id!, imageType ?? ImageType.Primary, 150, 150),
		retry: 2,
		gcTime: 1000 * 60, // 1 minute
		staleTime: 1000 * 60, // 1 minute,
	})

	return (
		<YStack alignItems='center' marginHorizontal={10}>
			<TamaguiAvatar borderRadius={!props.circular ? 4 : 'unset'} {...props}>
				<TamaguiAvatar.Image src={data ?? undefined} />
				<TamaguiAvatar.Fallback backgroundColor='$borderColor' />
			</TamaguiAvatar>
			{props.children && <Text>{props.children}</Text>}
			{subheading && <Text bold>{subheading}</Text>}
		</YStack>
	)
}
