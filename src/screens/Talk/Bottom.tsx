import { dateToUnix, useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, nip04, signEvent } from 'nostr-tools';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Input from '../../components/Input';
import { useUserContext } from '../../context/UserContext';
import { useMessages } from '../../hooks/useMessages';
import { useUsers } from '../../hooks/useUsers';
import { Theme } from '../../providers/ThemeProvider';

type BottomProps = {
  pubkey: string;
};

const Bottom = ({ pubkey }: BottomProps) => {
  const [text, setText] = useState('');
  const { addUser } = useUsers();
  const { key, pubkey: userPubkey } = useUserContext();
  const { publish } = useNostr();
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { addMessage } = useMessages();

  const onSend = useCallback(async () => {
    // TODO: verify pubkey
    console.log(`send to: ${pubkey}`);
    setText('');

    const message = await nip04.encrypt(key, pubkey, text);
    const created_at = dateToUnix();

    const event: Event = {
      content: message,
      kind: Kind.EncryptedDirectMessage,
      tags: [['p', pubkey]],
      created_at: created_at,
      pubkey: userPubkey,
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, key);

    await addMessage({ ...event, pending: true, seen: true, content: text });

    await addUser({
      pubkey: pubkey,
    });

    publish(event);
  }, [addUser, pubkey, publish, key, userPubkey, text, addMessage]);

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
};

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
