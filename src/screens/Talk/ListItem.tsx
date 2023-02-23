import * as Clipboard from 'expo-clipboard';
import { dateToUnix, useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, signEvent } from 'nostr-tools';
import React, { memo, useCallback, useRef, useState } from 'react';
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
  userPubkey: string;
  message: Message;
  prevMessage: Message;
  nextMessage: Message;
  replyMessage: Message;
  side: Side;
  setReply: ({ id, content }: { id: string; content: string }) => void;
  setMessageBoxRef: (ref: any) => void;
};

const ListItem = ({
  user,
  userPubkey,
  message,
  prevMessage,
  nextMessage,
  replyMessage,
  side,
  setReply,
  setMessageBoxRef,
}: ListItemProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { pubkey, key } = useUserContext();
  const { publish } = useNostr();

  const onReply = useCallback(
    (ref: any) => {
      setVisible(false);

      if (ref) setReply({ id: message.id, content: message.content });
      else setReply(undefined);

      setMessageBoxRef(ref);
    },
    [message.id, message.content, setReply],
  );

  const onCopy = useCallback(async () => {
    setVisible(false);
    await Clipboard.setStringAsync(message.content);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  }, [message.content]);

  const onReaction = useCallback(
    (reaction: Reaction) => {
      setVisible(false);
      const tags = [
        ['e', message.id],
        ['p', pubkey],
        ['p', userPubkey],
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
    [key, pubkey, publish, message.id, userPubkey],
  );

  return (
    <View style={styles.scaleYInverted}>
      <DateDivider
        createdAt={message.created_at}
        prevCreatedAt={prevMessage?.created_at}
      />
      <ReplyBox replyMessage={replyMessage} side={side} />
      <MessageBox
        content={message.content}
        pending={message.pending}
        reaction={message.reaction}
        other_reaction={message.other_reaction}
        side={side}
        user={side === 'left' ? user : undefined}
        onMenu={setVisible}
        onReply={onReply}
      />
      <MenuMessageBox
        onChange={setVisible}
        onReply={onReply}
        onCopy={onCopy}
        onReaction={onReaction}
        visible={visible}
        pending={message.pending}
        side={side}
      />
      <TimeIndicator
        createdAt={message.created_at}
        nextCreatedAt={nextMessage?.created_at}
        pubkey={message.pubkey}
        nextPubkey={nextMessage?.pubkey}
        side={side}
      />
      {message.reaction || message.other_reaction ? (
        <View style={styles.margin} />
      ) : (
        <></>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scaleYInverted: {
    scaleY: -1,
  },
  margin: { marginBottom: 18 },
});

export default memo(ListItem);
