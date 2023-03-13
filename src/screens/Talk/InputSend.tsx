import { EventTemplate, Kind, nip04 } from 'nostr-tools';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import Input from '../../components/Input';
import { useNostrContext } from '../../context/NostrContext';
import { useUserContext } from '../../context/UserContext';
import { useMessages } from '../../hooks/useMessages';
import { useUsers } from '../../hooks/useUsers';
import { Theme } from '../../providers/ThemeProvider';

type InputSendProps = {
  pubkey: string;
  onCloseReply: () => void;
  replyId?: string;
};

const InputSend = ({ pubkey, replyId, onCloseReply }: InputSendProps) => {
  const [text, setText] = useState('');
  const { addUser, updateUserLastEventAt } = useUsers();
  const { key, pubkey: userPubkey } = useUserContext();
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { addMessage } = useMessages();
  const { publish } = useNostrContext();

  const onSend = useCallback(async () => {
    // TODO: verify pubkey
    console.log(`send to: ${pubkey}`);
    setText('');

    const message = await nip04.encrypt(key, pubkey, text);
    const created_at = Math.floor(Date.now() / 1000);

    const template: EventTemplate = {
      content: message,
      kind: Kind.EncryptedDirectMessage,
      tags: [['p', pubkey]],
      created_at: created_at,
    };

    if (replyId) {
      template.tags.push(['e', replyId]);
      onCloseReply();
    }

    const event = publish(template);

    await addMessage({ ...event, pending: true, seen: true, content: text });
    await addUser({
      pubkey: pubkey,
    });
    await updateUserLastEventAt({
      pubkey: pubkey,
      lastEventAt: created_at,
    });
  }, [
    pubkey,
    replyId,
    key,
    userPubkey,
    text,
    addMessage,
    addUser,
    onCloseReply,
    publish,
    updateUserLastEventAt,
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
      backgroundColor: colors.secondaryContainer,
    },
  });
};

export default InputSend;
