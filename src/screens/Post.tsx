import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { dateToUnix, useNostr } from "nostr-react";
import { Event, getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { RootStackParamList } from "../navigation";
import { useStores } from "../store";

type PostScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const PostScreen = ({ route, navigation }: PostScreenProps) => {
  const [text, setText] = useState("");
  const { userStore } = useStores();
  const { publish } = useNostr();

  const handlePost = () => {
    const event: Event = {
      content: text,
      kind: 1,
      tags: [],
      created_at: dateToUnix(),
      pubkey: getPublicKey(userStore.key),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
    navigation.goBack();
  };

  return (
    <View>
      <TextInput
        label="Post"
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <Button mode="contained" style={styles.button} onPress={handlePost}>
        Post
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 15,
  },
});

export default PostScreen;
