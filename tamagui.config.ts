import { animations, tokens as TamaguiTokens, media, shorthands } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui' // or '@tamagui/core'
import { headingFont, bodyFont } from './fonts.config'

const tokens = createTokens({
  ...TamaguiTokens,
  color: {
    danger: "#ff0000",
    purpleDark: "#0C0622",
    purple: "#100538",
    purpleGray: "#66617B",
    amethyst: "#7E72AF",
    grape: "#5638BB",
    telemagenta: "#cc2f71",
    white: "#ffffff",
    black: "#000000"
  },
})

const jellifyConfig = createTamagui({
    animations,
    fonts:{
        heading: headingFont,
        body: bodyFont,
    },
    media,
    shorthands,
    tokens,
    themes: {
      dark: {
        shadowColor: tokens.color.purple,
        background: tokens.color.purpleDark,
        backgroundActive: tokens.color.amethyst,
        backgroundPress: tokens.color.amethyst,
        backgroundFocus: tokens.color.amethyst,
        backgroundHover: tokens.color.purpleGray,
        borderColor: tokens.color.amethyst,
        color: tokens.color.white
      },
      dark_inverted_purple: {
        color: tokens.color.purpleDark,
        borderColor: tokens.color.amethyst,
        background: tokens.color.amethyst
      },
      light: {
        background: tokens.color.white,
        borderColor: tokens.color.purpleGray,
        color: tokens.color.purpleDark
      },
      light_inverted_purple: {
        color: tokens.color.amethyst,
        borderColor: tokens.color.purpleGray,
        background: tokens.color.amethyst
      }
    }
});

export type JellifyConfig = typeof jellifyConfig

declare module 'tamagui' {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends JellifyConfig {}
}

export default jellifyConfig