import React from "react";
import { SliderProps as TamaguiSliderProps, SliderVerticalProps, Slider as TamaguiSlider, styled, Slider, getTokens, useTheme } from "tamagui";

interface SliderProps {
    value?: number | undefined;
    max: number;
    width?: number | undefined
    props: TamaguiSliderProps
}

const JellifyActiveSliderTrack = styled(Slider.TrackActive, {
    backgroundColor: getTokens().color.$telemagenta
})

export function HorizontalSlider({ 
    value, 
    max,
    width, 
    props 
}: { 
    value?: number | undefined, 
    max: number;
    width?: number | undefined, 
    props?: TamaguiSliderProps | undefined
}) : React.JSX.Element {
    
    const theme = useTheme()

    const JellifySliderThumb = styled(Slider.Thumb, {
        backgroundColor: theme.background,
        borderColor: theme.borderColor,
    })
    
    const JellifySliderTrack = styled(Slider.Track, {
        backgroundColor: theme.borderColor
    });
    
    return (
        <TamaguiSlider 
        width={width} 
        value={value ? [value] : []}
        max={max} 
        step={1}
        orientation="horizontal"
        marginHorizontal={10}
        { ...props }
        >
            <JellifySliderTrack size="$4">
                <JellifyActiveSliderTrack size={"$4"} />
            </JellifySliderTrack>
            <JellifySliderThumb circular index={0} size={"$1"} />
        </TamaguiSlider>
    )
}
  
export function VerticalSlider(props: SliderVerticalProps) : React.JSX.Element {

    const theme = useTheme()

    const JellifySliderThumb = styled(Slider.Thumb, {
        backgroundColor: theme.background,
        borderColor: theme.borderColor,
    })
    
    const JellifySliderTrack = styled(Slider.Track, {
        backgroundColor: theme.borderColor
    });

    return ( 
        <TamaguiSlider 
            size="$3" 
            width={200} 
            defaultValue={[0]} 
            max={100} 
            step={1}
            orientation="vertical"
            marginVertical={10}
        >
            <JellifySliderTrack>
                <JellifyActiveSliderTrack />
            </JellifySliderTrack>
            <JellifySliderThumb circular index={0} size={"$2"} />
        </TamaguiSlider>
    )
}