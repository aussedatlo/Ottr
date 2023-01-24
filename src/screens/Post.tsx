import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { dateToUnix, useNostr } from "nostr-react";
import {
  Event,
  getEventHash,
  getPublicKey,
  signEvent,
  nip04,
  Kind,
} from "nostr-tools";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import Input from "../components/Input";
import { RootStackParamList } from "../navigation";
import { useStores } from "../store";

type PostScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
const PUBKEYS = [
  "edcc4867656e590eff1b84ce3a8e0035eb9fb299bc18c2bc8f72af8e6321a507", // Pixel
  "487b9c0491305feab5bfae7ebaf4bc6c6f1e827567bb8ff47dca23a623e25deb", // samsung
];

const PostScreen = ({ route, navigation }: PostScreenProps) => {
  const [text, setText] = useState("");
  const { userStore } = useStores();
  const { publish } = useNostr();

  useEffect(() => console.log(getPublicKey(userStore.key)));

  const handlePost = async () => {
    const message = await nip04.encrypt(userStore.key, PUBKEYS[1], text);
    console.log(message);
    const event: Event = {
      content: message,
      kind: Kind.EncryptedDirectMessage,
      tags: [["p", "receiverpublickey"]],
      created_at: dateToUnix(),
      pubkey: getPublicKey(userStore.key),
    };
    console.log("TEST");

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);
    console.log("TEST");

    publish(event);
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <Input
        label="write your post here"
        value={text}
        onChangeText={(text) => setText(text)}
        multiline
        numberOfLines={5}
      />
      <Button mode="contained" style={styles.button} onPress={handlePost}>
        Post
      </Button>
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

export default PostScreen;
