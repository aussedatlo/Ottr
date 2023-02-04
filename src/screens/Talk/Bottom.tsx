import { observer } from 'mobx-react';
import { dateToUnix, useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, nip04, signEvent } from 'nostr-tools';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Input from '../../components/Input';
import { Theme } from '../../providers/ThemeProvider';
import { useStores } from '../../store';

type BottomProps = {
  pubkey: string;
};

const Bottom = observer(({ pubkey }: BottomProps) => {
  const [text, setText] = useState('');
  const { userStore, messageStore, contactStore } = useStores();
  const { publish } = useNostr();
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

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

    contactStore.addContact({
      pubkey: pubkey,
    });
  }, [
    contactStore,
    messageStore,
    pubkey,
    publish,
    userStore.key,
    userStore.pubkey,
    text,
  ]);

  return (
    <View style={styles.root}>
      <Input
        roundness={20}
        style={styles.input}
        value={text}
        onChange={(e) => setText(e.nativeEvent.text)}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        right={
          <TextInput.Icon
            onPress={onSend}
            size={20}
            icon={'send'}
            color={theme.colors.secondary}
          />
        }
        multiline
      />
    </View>
  );
});

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      width: '100%',
    },
    input: {
      margin: 10,
      borderRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: colors.tertiaryContainer,
    },
  });
};

export default Bottom;
