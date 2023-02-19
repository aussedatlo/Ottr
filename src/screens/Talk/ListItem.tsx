import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Side } from '.';
import { Message } from '../../types/message';
import { User } from '../../types/user';
import DateDivider from './DateDivider';
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
  setReply: (message: Message) => void;
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
  return (
    <View style={styles.scaleYInverted}>
      <DateDivider message={message} prevMessage={prevMessage} />
      <ReplyBox replyMessage={replyMessage} side={side} />
      <MessageBox
        message={message}
        onReply={setReply}
        side={side}
        user={side === 'left' ? user : undefined}
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
