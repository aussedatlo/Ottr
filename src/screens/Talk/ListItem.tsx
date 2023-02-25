import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MenuState, Side } from '.';
import { Message } from '../../types/message';
import DateDivider from './DateDivider';
import MessageBox from './MessageBox';
import ReplyBox from './ReplyBox';
import TimeIndicator from './TimeIndicator';

type ListItemProps = {
  userPubkey: string;
  otherPubkey: string;
  otherPicture: string;
  message: Message;
  prevMessage: Message;
  nextMessage: Message;
  replyMessage: Message;
  onMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  animate: boolean;
};

const ListItem = ({
  userPubkey,
  otherPubkey,
  otherPicture,
  message,
  prevMessage,
  nextMessage,
  replyMessage,
  onMenu,
  animate,
}: ListItemProps) => {
  const side: Side = useMemo(
    () => (message.pubkey === userPubkey ? 'right' : 'left'),
    [message.pubkey, userPubkey],
  );

  return (
    <View style={styles.scaleYInverted}>
      <DateDivider
        createdAt={message.created_at}
        prevCreatedAt={prevMessage?.created_at}
      />
      <ReplyBox replyMessage={replyMessage} side={side} />
      <MessageBox
        id={message.id}
        content={message.content}
        pending={message.pending}
        reaction={message.reaction}
        otherReaction={message.other_reaction}
        side={side}
        otherPubkey={otherPubkey}
        otherPicture={otherPicture}
        onMenu={onMenu}
        animate={animate}
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
