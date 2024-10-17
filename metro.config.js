const {withNativeWind} = require('nativewind/metro');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(__dirname, {
    isCSSEnabled: true
});

config.resolver.sourceExts.push('mjs');

module.exports = withNativeWind(config, { input: "./global.css"});
