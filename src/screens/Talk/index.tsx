import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import { dateToUnix, useNostr } from "nostr-react";
import {
  Event,
  getEventHash,
  getPublicKey,
  Kind,
  nip04,
  signEvent,
} from "nostr-tools";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import Input from "../../components/Input";
import { RootStackParamList } from "../../navigation";
import { useStores } from "../../store";
import Message from "./MessageBox";

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, "Talk">;

const TalkScreen = observer(({ route, navigation }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const [text, setText] = useState("");
  const { userStore, messageStore } = useStores();
  const { publish } = useNostr();
  const { messageList } = messageStore;

  const messageListReverse = useMemo(
    () => messageList[pubkey]?.slice().reverse(),
    [messageList[pubkey].length]
  );

  const onSend = useCallback(async () => {
    // TODO: verify pubkey
    console.log(`send to: ${pubkey}`);
    setText("");

    const message = await nip04.encrypt(userStore.key, pubkey, text);
    const created_at = dateToUnix();

    messageStore.addMessage(pubkey, {
      id: undefined,
      content: text,
      created_at: created_at,
      pubkey: userStore.pubkey,
      isSend: false,
      isSender: true,
    });

    const event: Event = {
      content: message,
      kind: Kind.EncryptedDirectMessage,
      tags: [["p", pubkey]],
      created_at: created_at,
      pubkey: userStore.pubkey,
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
  }, [text]);

  const renderItemCallback = useCallback(
    (props) => <Message {...props.item} />,
    [JSON.stringify(messageList[pubkey])]
  );

  return (
    <View>
      <View style={{ paddingBottom: 50, height: "100%" }}>
        <FlatList
          data={messageListReverse}
          renderItem={renderItemCallback}
          inverted
        />
      </View>

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Input
          value={text}
          onChange={(e) => setText(e.nativeEvent.text)}
          right={<TextInput.Icon onPress={onSend} size={20} icon={"send"} />}
          multiline
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    margin: 15,
  },
});

export default TalkScreen;
