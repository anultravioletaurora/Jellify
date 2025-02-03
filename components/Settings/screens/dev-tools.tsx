import { StackParamList } from "@/components/types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import DevTools from "../helpers/dev-tools"

export default function DevToolsScreen({
    navigation
} : {
    navigation: NativeStackNavigationProp<StackParamList>
 }) : React.JSX.Element {

    return (
        <DevTools />
    )
 }