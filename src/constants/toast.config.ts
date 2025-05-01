import { BaseToast, BaseToastProps, ToastConfig } from 'react-native-toast-message'
import { getToken } from 'tamagui'

/**
 * Configures the toast for the Jellify app, using Tamagui style tokens
 * @param isDarkMode Whether the app is in dark mode, taken from the useColorScheme hook
 * @returns The {@link ToastConfig} for the Jellify app
 */
const JellifyToastConfig: (isDarkMode: boolean) => ToastConfig = (isDarkMode: boolean) => ({
	success: (props: BaseToastProps) =>
		BaseToast({
			...props,
			style: {
				borderLeftColor: getToken('$color.success'),
				backgroundColor: isDarkMode ? getToken('$color.purple') : getToken('$color.white'),
			},
			text1Style: {
				fontFamily: 'Aileron-Bold',
				color: isDarkMode ? getToken('$color.white') : getToken('$color.purpleDark'),
			},
		}),
	error: (props: BaseToastProps) =>
		BaseToast({
			...props,
			style: {
				borderLeftColor: getToken('$color.danger'),
				backgroundColor: isDarkMode ? getToken('$color.purple') : getToken('$color.white'),
			},
			text1Style: {
				fontFamily: 'Aileron-Bold',
				color: isDarkMode ? getToken('$color.white') : getToken('$color.purpleDark'),
			},
		}),
})

export default JellifyToastConfig
