import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { MenuState, Side } from '.';
import { Message } from '../../types/message';
import { User } from '../../types/user';
import DateDivider from './DateDivider';
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
  onMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  animate: boolean;
};

const ListItem = ({
  user,
  message,
  prevMessage,
  nextMessage,
  replyMessage,
  side,
  onMenu,
  animate,
}: ListItemProps) => {
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
        other_reaction={message.other_reaction}
        side={side}
        user={side === 'left' ? user : undefined}
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
