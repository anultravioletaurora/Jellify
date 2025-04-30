import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { getTokens } from 'tamagui'

interface Fonts {
	regular: FontStyle
	medium: FontStyle
	bold: FontStyle
	heavy: FontStyle
}

interface FontStyle {
	fontFamily: string
	fontWeight:
		| 'normal'
		| 'bold'
		| '200'
		| '900'
		| '100'
		| '500'
		| '300'
		| '400'
		| '600'
		| '700'
		| '800'
}

const JellifyFonts: Fonts = {
	regular: {
		fontFamily: 'Aileron SemiBold',
		fontWeight: 'normal',
	},
	medium: {
		fontFamily: 'Aileron Heavy',
		fontWeight: 'normal',
	},
	bold: {
		fontFamily: 'Aileron Bold',
		fontWeight: 'bold',
	},
	heavy: {
		fontFamily: 'Aileron Black',
		fontWeight: 'bold',
	},
}

export const JellifyDarkTheme: ReactNavigation.Theme = {
	dark: true,
	colors: {
		...DarkTheme.colors,
		card: getTokens().color.$purpleDark.val,
		border: getTokens().color.$amethyst.val,
		background: getTokens().color.$purpleDark.val,
		primary: getTokens().color.$telemagenta.val,
	},
	fonts: JellifyFonts,
}

export const JellifyLightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: getTokens().color.$telemagenta.val,
	},
	fonts: JellifyFonts,
}
