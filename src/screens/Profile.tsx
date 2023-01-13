import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "..";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};

export default ProfileScreen;
