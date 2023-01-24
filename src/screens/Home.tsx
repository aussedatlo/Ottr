import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import { useCallback } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import { RootStackParamList } from "../navigation";
import { useStores } from "../store";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = observer(({ route, navigation }: HomeScreenProps) => {
  const { userStore } = useStores();

  const renderItemCallback = useCallback(
    ({ item }) => {
      return (
        <Text style={{ margin: 20 }}>
          {JSON.stringify(userStore.messageList[item])}
        </Text>
      );
    },
    [userStore]
  );

  return (
    <>
      <SafeAreaView>
        <FlatList
          data={Object.keys(userStore.messageList)}
          renderItem={renderItemCallback}
          keyExtractor={(item) => item}
          style={{ height: " 100%" }}
        />
      </SafeAreaView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("SelectContact")}
      />
    </>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
