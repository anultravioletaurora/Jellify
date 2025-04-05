// https://docs.swmansion.com/react-native-gesture-handler/docs/guides/testing
module.exports = {
  preset: 'jest-expo',
  setupFiles: ["./node_modules/react-native-gesture-handler/jestSetup.js"],
  setupFilesAfterEnv:  ["./jest/setup.js"],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transformIgnorePatterns: [
'node_modules/(?!(@)?(react-native|react-native-url-polyfill|react-navigation|react-native-track-player|jellyfin|burnt|expo|expo-modules-core)/)',
  ],
};
