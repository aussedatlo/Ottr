import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { Message } from '../../types/message';

type MessageProps = Message;

const MessageBox = ({
  content,
  created_at,
  isSend,
  isSender,
}: MessageProps) => {
  const time = new Date(created_at * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.messageContainer,
          isSender
            ? [styles.rightBox, styles.right]
            : [styles.leftBox, styles.left],
        ]}
      >
        <Text style={isSender ? styles.rightText : {}}>{content}</Text>
      </View>
      <View
        style={[styles.timeContainer, isSender ? styles.right : styles.left]}
      >
        {isSender ? (
          <>
            <Text>{time}</Text>
            <Avatar.Icon
              icon={isSend ? 'check-all' : 'check'}
              size={20}
              style={styles.avatar}
            />
          </>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  messageContainer: {
    padding: 15,
    borderRadius: 15,
    margin: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    margin: 0,
    marginRight: 15,
    marginBottom: 10,
  },
  right: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  left: {
    alignSelf: 'flex-start',
  },
  rightBox: {
    backgroundColor: '#1280FA',
  },
  leftBox: {
    backgroundColor: '#EDEBF0',
  },
  rightText: {
    color: 'white',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  time: { fontSize: 10, marginRight: 5 },
  name: { fontSize: 14, fontWeight: '600', marginBottom: 5 },
  avatar: {
    marginLeft: 5,
  },
});

export default memo(MessageBox);
