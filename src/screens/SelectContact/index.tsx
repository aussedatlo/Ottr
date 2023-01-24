import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Searchbar, Text } from "react-native-paper";
import { RootStackParamList } from "../../navigation";
import { useStores } from "../../store";

type SelectContactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SelectContact"
>;

const SelectContactScreen = ({
  route,
  navigation,
}: SelectContactScreenProps) => {
  const [text, setText] = useState("");
  const { userStore } = useStores();

  const onStartConversation = async () => {
    // TODO: verify format
    userStore.follow({ pub: text });
    navigation.navigate("Talk", { pub: text });
  };

  return (
    <View style={styles.root}>
      <Searchbar
        value={text}
        onChangeText={(text) => setText(text)}
        placeholder="public key or identifier"
      />

      <Button onPress={onStartConversation}>Start a conversation</Button>

      {Object.keys(userStore.messageList)?.map((pubkey) => (
        <View key={pubkey}>
          <Text onPress={() => navigation.navigate("Talk", { pub: pubkey })}>
            {pubkey}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  button: {
    margin: 15,
  },
});

export default SelectContactScreen;
