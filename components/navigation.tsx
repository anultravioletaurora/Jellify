import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Player from "./Player/stack";
import { Tabs } from "./tabs";
import { StackParamList } from "./types";
import DetailsScreen from "./ItemDetail/screen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Navigation(): React.JSX.Element {

  const RootStack = createNativeStackNavigator<StackParamList>();

  console.debug("Rendering navigational tree...")
  
    return (
      <SafeAreaView>

      <RootStack.Navigator>
          <RootStack.Screen 
            name="Tabs" 
            component={Tabs}
            options={{
              headerShown: false
            }}
            />
          <RootStack.Screen 
            name="Player" 
            component={Player} 
            options={{
              headerShown: false,
              presentation: 'modal'
            }}
            />
    </RootStack.Navigator>
            </SafeAreaView>
    )
}