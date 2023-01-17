import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { dateToUnix, useNostr } from "nostr-react";
import { Event, getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import Input from "../components/Input";
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
