import { CarPlay, TabBarTemplate } from "react-native-carplay";
import CarPlayHome from "./Home";

const CarPlayNavigation : TabBarTemplate = new TabBarTemplate({
    title: 'Navigation',
    templates: [
        CarPlayHome
    ],
    onTemplateSelect(template, e) {
        if (template)
            CarPlay.pushTemplate(template, true)
    },
});

export default CarPlayNavigation;