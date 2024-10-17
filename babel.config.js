module.exports = {
  presets: ['module:@react-native/babel-preset', "nativewind/babel"],
  plugins: [// react-native-reanimated/plugin has to be listed last
  'react-native-reanimated/plugin', ["module-resolver", {
    root: ["./"],
    extensions: [".js", ".ts", ".tsx", ".jsx"],

    alias: {
      "@": "./"
    }
  }]]
};
