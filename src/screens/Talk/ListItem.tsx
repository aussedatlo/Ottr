import * as Clipboard from 'expo-clipboard';
import { dateToUnix, useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, signEvent } from 'nostr-tools';
import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Side } from '.';
import { useUserContext } from '../../context/UserContext';
import { Message } from '../../types/message';
import { Reaction } from '../../types/reaction';
import { User } from '../../types/user';
import DateDivider from './DateDivider';
import MenuMessageBox from './MenuMessageBox';
import MessageBox from './MessageBox';
import ReplyBox from './ReplyBox';
import TimeIndicator from './TimeIndicator';

type ListItemProps = {
  user: User;
  message: Message;
  prevMessage: Message;
  nextMessage: Message;
  replyMessage: Message;
  side: Side;
  setReply: ({ id, content }: { id: string; content: string }) => void;
};

const ListItem = ({
  user,
  message,
  prevMessage,
  nextMessage,
  replyMessage,
  side,
  setReply,
}: ListItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { pubkey, key } = useUserContext();
  const { publish } = useNostr();

  const onReply = useCallback(() => {
    setVisible(false);
    setReply({ id: message.id, content: message.content });
  }, [message.id, message.content, setReply]);

  const onCopy = useCallback(async () => {
    setVisible(false);
    await Clipboard.setStringAsync(message.content);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  }, []);

  const onReaction = useCallback((reaction: Reaction) => {
    setVisible(false);
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
  }, []);

  return (
    <View style={styles.scaleYInverted}>
      <DateDivider message={message} prevMessage={prevMessage} />
      <ReplyBox replyMessage={replyMessage} side={side} />
      <MessageBox
        message={message}
        side={side}
        user={side === 'left' ? user : undefined}
        onMenu={setVisible}
      />
      <MenuMessageBox
        onChange={setVisible}
        onReply={onReply}
        onCopy={onCopy}
        onReaction={onReaction}
        visible={visible}
        side={side}
      />
      <TimeIndicator message={message} nextMessage={nextMessage} side={side} />
    </View>
  );
};

const styles = StyleSheet.create({
  scaleYInverted: {
    scaleY: -1,
  },
});

export default memo(ListItem);
