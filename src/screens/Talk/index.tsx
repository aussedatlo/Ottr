import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import { dateToUnix, useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, nip04, signEvent } from 'nostr-tools';
import React, { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import Input from '../../components/Input';
import { RootStackParamList } from '../../navigation';
import { useStores } from '../../store';
import { Message } from '../../types/message';
import MessageBox from './MessageBox';

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, 'Talk'>;

const TalkScreen = observer(({ route }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const [text, setText] = useState('');
  const { userStore, messageStore } = useStores();
  const { publish } = useNostr();
  const messageList = messageStore.messageList.get(pubkey);

  // Update component when messages status is updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const messagesNotSend: Array<Message> =
    messageList?.length > 0
      ? messageList.filter((message) => !message.isSend)
      : [];

  const onSend = useCallback(async () => {
    // TODO: verify pubkey
    console.log(`send to: ${pubkey}`);
    setText('');

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
      tags: [['p', pubkey]],
      created_at: created_at,
      pubkey: userStore.pubkey,
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
  }, [messageStore, pubkey, publish, userStore.key, userStore.pubkey, text]);

  const renderItem = ({ item }) => <MessageBox {...item} />;

  return (
    <View>
      <View style={{ paddingBottom: 50, height: '100%' }}>
        <FlatList
          data={messageList?.slice().reverse()}
          renderItem={renderItem}
          inverted
        />
      </View>

      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Input
          value={text}
          onChange={(e) => setText(e.nativeEvent.text)}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          right={<TextInput.Icon onPress={onSend} size={20} icon={'send'} />}
          multiline
        />
      </View>
    </View>
  );
});

export default TalkScreen;
