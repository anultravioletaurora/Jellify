// https://docs.swmansion.com/react-native-gesture-handler/docs/guides/testing
module.exports = {
	preset: 'jest-expo',
	setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
	setupFilesAfterEnv: [
		'./jest/setup.ts',
		'./jest/setup-carplay.ts',
		'./jest/setup-blurhash.ts',
		'./jest/setup-device-info.js', // JS to prevent Typescript implicit any warning
		'./jest/setup-reanimated.ts',
		'./jest/setup-rnfs.ts',
		'./jest/setup-rntp.ts',
		'./tamagui.config.ts',
	],
	extensionsToTreatAsEsm: ['.ts', '.tsx'],
	transformIgnorePatterns: [
		'node_modules/(?!(@)?(react-native|react-native-.*|react-navigation|jellyfin|burnt|expo|expo-.*)/)',
	],
}
