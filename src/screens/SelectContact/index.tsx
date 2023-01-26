import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Searchbar, Text } from "react-native-paper";
import { RootStackParamList } from "../../navigation";
import { useStores } from "../../store";
import ContactBox from "./ContactBox";

type SelectContactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SelectContact"
>;

const SelectContactScreen = ({
  route,
  navigation,
}: SelectContactScreenProps) => {
  const [text, setText] = useState("");
  const { messageStore } = useStores();

  const onStartConversation = async () => {
    // TODO: verify format
    // userStore.follow({ pub: text });
    navigation.navigate("Talk", { pubkey: text });
  };

  const renderItemCallback = useCallback(
    ({ item }) => <ContactBox key={item} pubkey={item} />,
    []
  );

  return (
    <View style={styles.root}>
      <Searchbar
        value={text}
        onChangeText={(text) => setText(text)}
        placeholder="public key or identifier"
      />

      <Button onPress={onStartConversation}>Start a conversation</Button>

      <FlatList
        data={Object.keys(messageStore.messageList)}
        renderItem={renderItemCallback}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  button: {
    margin: 15,
    marginBottom: 25,
  },
});

export default SelectContactScreen;
