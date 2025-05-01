// https://docs.swmansion.com/react-native-gesture-handler/docs/guides/testing
module.exports = {
	preset: 'react-native',
	setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
	setupFilesAfterEnv: [
		'./jest/setup.ts',
		'./jest/setup-carplay.ts',
		'./jest/setup-device-info.js', // JS to prevent Typescript implicit any warning
		'./jest/setup-reanimated.ts',
		'./jest/setup-rnfs.ts',
		'./jest/setup-rntp.ts',
		'./tamagui.config.ts',
		'./jest/setup-native-modules.ts',
	],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	transformIgnorePatterns: [
		'node_modules/(?!(@)?(react-native|react-native-.*|react-navigation|jellyfin|burnt|expo|expo-.*)/)',
	],
}
