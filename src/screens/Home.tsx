import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Observer } from "mobx-react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { RootStackParamList } from "..";
import { useStores } from "../store";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const { userStore } = useStores();

  return (
    <Observer>
      {() => (
        <View>
          <Text>Home</Text>
          <Text>{userStore.key}</Text>
        </View>
      )}
    </Observer>
  );
};

export default HomeScreen;
