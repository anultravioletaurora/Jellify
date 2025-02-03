import { fonts } from "@tamagui/config/v4";
import { createFont } from "tamagui";

const aileronFace = {
    100: { normal: 'Aileron-UltraLight', italic: 'Aileron UltraLight Italic' },
    200: { normal: 'Aileron-Thin', italic: 'Aileron Thin Italic' },
    300: { normal: 'Aileron-Light', italic: 'Aileron Light Italic' },
    400: { normal: 'Aileron-Regular', italic: 'Aileron Italic'} ,
    500: { normal: 'Aileron-Regular', italic: 'Aileron Italic' },
    600: { normal: 'Aileron-SemiBold', italic: 'Aileron SemiBold Italic' },
    700: { normal: 'Aileron-Bold', italic: 'Aileron Bold Italic' },
    800: { normal: 'Aileron-Heavy', italic: 'Aileron Heavy Italic' },
    900: { normal: 'Aileron-Black', italic: 'Aileron-BlackItalic' }
};

export const bodyFont = createFont({
    family: "Aileron-Bold",
    size: fonts.body.size,
    lineHeight: fonts.body.lineHeight,
    weight: fonts.body.weight,
    letterSpacing: fonts.body.letterSpacing,
    face: aileronFace
})

export const headingFont = createFont({
    family: "Aileron-Black",
    size: fonts.heading.size,
    lineHeight: fonts.heading.lineHeight,
    weight: fonts.heading.weight,
    letterSpacing: fonts.heading.letterSpacing,
    face: aileronFace
})