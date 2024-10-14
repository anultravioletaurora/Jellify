const {withNativeWind} = require('nativewind/metro');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativeWind(config, {
 input: "./global.css"
});
