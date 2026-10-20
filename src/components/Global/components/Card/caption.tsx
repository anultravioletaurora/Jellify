import { YStack, SizableText } from 'tamagui'

interface ItemCardCaptionProps {
	captionAlign: 'center' | 'left' | 'right'
	caption?: string | null | undefined
	subCaption?: string | null | undefined
	width: number
}

export default function ItemCardCaption({
	captionAlign = 'center',
	caption,
	subCaption,
	width,
}: ItemCardCaptionProps): React.JSX.Element | null {
	if (!caption) return null

	return (
		<YStack width={width}>
			<SizableText
				fontWeight={'6'}
				lineBreakStrategyIOS='standard'
				numberOfLines={1}
				textAlign={captionAlign}
				fontSize={'3'}
			>
				{caption}
			</SizableText>

			{subCaption && (
				<SizableText
					lineBreakStrategyIOS='standard'
					numberOfLines={1}
					textAlign={captionAlign}
					fontSize={'3'}
				>
					{subCaption}
				</SizableText>
			)}
		</YStack>
	)
}
