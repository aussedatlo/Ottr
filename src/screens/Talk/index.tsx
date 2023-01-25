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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import Input from "../../components/Input";
import { RootStackParamList } from "../../navigation";
import { useStores } from "../../store";
import Message from "./MessageBox";

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, "Talk">;

const TalkScreen = observer(({ route, navigation }: TalkScreenProps) => {
  const pub = route.params.pub;
  const [text, setText] = useState("");
  const { userStore } = useStores();
  const { publish } = useNostr();
  const { messageList } = userStore;

  const messageListReverse = useMemo(
    () => messageList[pub]?.slice().reverse(),
    [messageList[pub].length]
  );

  const onSend = useCallback(async () => {
    // TODO: verify pub
    console.log(`send to: ${pub}`);
    userStore.follow(pub);
    setText("");

    const message = await nip04.encrypt(userStore.key, pub, text);
    const created_at = dateToUnix();

    userStore.addMessage(pub, {
      id: undefined,
      content: text,
      created_at: created_at,
      pubkey: getPublicKey(userStore.key),
      isSend: false,
      isSender: true,
    });

    const event: Event = {
      content: message,
      kind: Kind.EncryptedDirectMessage,
      tags: [["p", pub]],
      created_at: created_at,
      pubkey: getPublicKey(userStore.key),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
  }, [text]);

  const renderItemCallback = useCallback(
    (props) => <Message {...props.item} />,
    [JSON.stringify(messageList[pub])]
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
