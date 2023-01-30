import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "react-native-paper";
import AppBar from "../components/AppBar";
import KeyScreen from "../screens/Key";
import ProfileScreen from "../screens/Profile";
import RelaysScreen from "../screens/Relays";
import SettingsScreen from "../screens/Settings";

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Key: undefined;
  Relays: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={"Settings"}
      screenOptions={{
        header: (props) => <AppBar {...props} />,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Key" component={KeyScreen} />
      <Stack.Screen name="Relays" component={RelaysScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
