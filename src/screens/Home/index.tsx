import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import { useCallback, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { RootStackParamList } from "../../navigation";
import { useStores } from "../../store";
import ContactMessageBox from "./ContactMessageBox";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = observer(({ route, navigation }: HomeScreenProps) => {
  const { contactStore, messageStore } = useStores();
  const { contactList } = contactStore;
  const { messageList } = messageStore;

  useEffect(() => {
    console.log("updateHome"), console.log(contactList);
  }, [JSON.stringify(contactList), JSON.stringify(messageList)]);

  const renderItemCallback = useCallback(
    ({ item }) => {
      return <ContactMessageBox contact={item} key={item.pubkey} />;
    },
    [JSON.stringify(contactList), JSON.stringify(messageList)]
  );

  return (
    <View style={styles.root}>
      <SafeAreaView>
        <FlatList
          data={contactList}
          renderItem={renderItemCallback}
          keyExtractor={(item) => item.pubkey}
          style={{ height: " 100%" }}
        />
      </SafeAreaView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("SelectContact")}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
