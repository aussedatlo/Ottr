import * as Clipboard from 'expo-clipboard';
import { Event, getEventHash, Kind, signEvent } from 'nostr-tools';
import { dateToUnix, useNostr } from 'nostr-react';
import React, { useMemo } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Menu } from 'react-native-material-menu';
import { IconButton, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';
import { Message } from '../../types/message';
import { useUserContext } from '../../context/UserContext';
import { Reaction } from '../../types/reaction';

type MenuMessageBoxProps = {
  message: Message;
  visible: boolean;
  onChange: (visible: boolean) => void;
  onReply: (message: Message) => void;
};

const MenuMessageBox = ({
  message,
  visible,
  onChange,
  onReply: onReplyCb,
}: MenuMessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { publish } = useNostr();
  const { pubkey, key } = useUserContext();

  const onCopy = async () => {
    onChange(false);
    await Clipboard.setStringAsync(message.content);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  };

  const onReply = () => {
    onChange(false);
    onReplyCb(message);
  };

  const onReaction = (reaction: Reaction) => {
    onChange(false);
    console.log(message);
    const tags =
      message.pubkey === pubkey
        ? [
            ...message.tags.filter((tag) => tag[0] !== 'e'),
            ['e', message.id],
            ['p', pubkey],
          ]
        : [
            ...message.tags.filter((tag) => tag[0] !== 'e'),
            ['e', message.id],
            ['p', message.pubkey],
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
  };

  const onNonImplemented = () => {
    ToastAndroid.show('Not implemented', ToastAndroid.SHORT);
  };

  return (
    <Menu
      visible={visible}
      onRequestClose={() => onChange(false)}
      anchor={<View />}
      style={styles.menu}
    >
      <View style={styles.container}>
        <IconButton
          size={20}
          icon="content-copy"
          onPress={onCopy}
          style={styles.button}
        />
        <IconButton
          size={20}
          icon="reply-outline"
          onPress={onReply}
          style={styles.button}
        />
        <IconButton
          size={20}
          icon="delete-outline"
          onPress={onNonImplemented}
          style={styles.button}
        />
        {message.pending ? (
          <IconButton
            size={20}
            icon="redo-variant"
            onPress={() => onChange(false)}
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
      </View>
    </Menu>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    menu: {
      backgroundColor: colors.tertiaryContainer,
      borderRadius: 10,
      marginTop: 3,
      elevation: 2,
    },
    container: { flexDirection: 'row' },
    button: {
      margin: 0,
    },
  });
};

export default MenuMessageBox;
