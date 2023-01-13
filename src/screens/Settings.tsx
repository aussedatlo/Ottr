import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "..";

type SettingsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Settings"
>;

const SettingsScreen = ({ route, navigation }: SettingsScreenProps) => {
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
};

export default SettingsScreen;
