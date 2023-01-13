import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "mobx-react";
import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppBar from "./components/AppBar";
import HomeScreen from "./screens/Home";
import ProfileScreen from "./screens/Profile";
import SettingsScreen from "./screens/Settings";
import observableStore from "./store";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider observableStore={observableStore}>
      <NavigationContainer>
        <PaperProvider>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              header: (props) => <AppBar {...props} />,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
}
