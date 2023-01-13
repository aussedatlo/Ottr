import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Observer, useObserver } from "mobx-react";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { RootStackParamList } from "..";
import { useStores } from "../store";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  const { userStore } = useStores();

  return (
    <Observer>
      {() => (
        <View>
          <TextInput
            value={userStore.key}
            onChange={(e) => userStore.setKey(e.nativeEvent.text)}
          />
        </View>
      )}
    </Observer>
  );
};

export default ProfileScreen;
