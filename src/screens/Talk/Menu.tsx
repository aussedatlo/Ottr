import { setStringAsync } from 'expo-clipboard';
import { dateToUnix, useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, signEvent } from 'nostr-tools';
import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import {
  IconButton,
  Menu as MenuPaper,
  MenuProps as MenuPropsPaper,
  useTheme,
} from 'react-native-paper';
import { MenuState, Reply } from '.';
import { useUserContext } from '../../context/UserContext';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';

export type MenuBoxProps = MenuState &
  Omit<MenuPropsPaper, 'children' | 'theme'> & {
    onReply: React.Dispatch<React.SetStateAction<Reply>>;
  };

const Menu = ({
  messageContent,
  messageId,
  pending,
  side,
  otherPubkey,
  onReply,
  onDismiss,
  ...props
}: MenuBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { pubkey, key } = useUserContext();
  const { publish } = useNostr();

  const onNonImplemented = () => {
    ToastAndroid.show('Not implemented', ToastAndroid.SHORT);
  };

  const onCopy = useCallback(async () => {
    onDismiss();
    await setStringAsync(messageContent);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  }, [messageContent, onDismiss]);

  const onReaction = useCallback(
    (reaction: Reaction) => {
      onDismiss();
      const tags = [
        ['e', messageId],
        ['p', pubkey],
        ['p', otherPubkey],
      ];
      const event: Event = {
        content: reaction,
        kind: Kind.Reaction,
        tags: tags,
        pubkey: pubkey,
        created_at: dateToUnix(),
      };
      event.id = getEventHash(event);
      event.sig = signEvent(event, key);

      publish(event);
    },
    [key, pubkey, publish, messageId, otherPubkey, onDismiss],
  );

  const onReplyMenu = useCallback(() => {
    onDismiss();
    onReply({ id: messageId, content: messageContent });
  }, [messageId, messageContent, onReply, onDismiss]);

  return (
    <MenuPaper {...props} onDismiss={onDismiss} contentStyle={styles.menu}>
      <IconButton
        size={20}
        icon="content-copy"
        onPress={onCopy}
        style={styles.button}
      />
      <IconButton
        size={20}
        icon="message-reply-outline"
        onPress={onReplyMenu}
        style={styles.button}
      />

      {side === 'right' ? (
        <IconButton
          size={20}
          icon="delete-outline"
          onPress={onNonImplemented}
          style={styles.button}
        />
      ) : (
        <></>
      )}

      {pending && side === 'right' ? (
        <IconButton
          size={20}
          icon="redo-variant"
          onPress={onNonImplemented}
          style={styles.button}
        />
      ) : (
        <></>
      )}

      <IconButton
        size={20}
        icon="thumb-up-outline"
        onPress={() => onReaction('+')}
        style={styles.button}
      />

      <IconButton
        size={20}
        icon="thumb-down-outline"
        onPress={() => onReaction('-')}
        style={styles.button}
      />
    </MenuPaper>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    menu: {
      backgroundColor: colors.tertiaryContainer,
      flexDirection: 'row',
      borderRadius: 10,
      elevation: 2,
    },
    button: {
      margin: 0,
    },
  });
};

export default memo(Menu);
