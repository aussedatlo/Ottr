import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { Side } from '.';
import { Theme } from '../../providers/ThemeProvider';
import { Message } from '../../types/message';

type ReplyBoxProps = {
  replyMessage: Message;
  side: Side;
};

const ReplyBox = ({ replyMessage, side }: ReplyBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme, side), [theme]);

  if (!replyMessage) return <></>;

  return (
    <View style={styles.root}>
      <Avatar.Icon icon="reply" size={15} style={styles.icon} />
      <Text style={styles.content} numberOfLines={1}>
        {replyMessage.content}
      </Text>
    </View>
  );
};

const createStyles = ({ colors }: Theme, side: Side) => {
  return StyleSheet.create({
    root: {
      maxWidth: '70%',
      marginLeft: 5,
      marginRight: 5,
      marginBottom: -13,
      padding: 15,
      flexDirection: 'row',
      borderRadius: 15,
      alignItems: 'center',
      backgroundColor: colors.secondaryContainer,
      alignSelf: side === 'right' ? 'flex-end' : 'flex-start',
    },
    content: {
      paddingRight: 8,
      color: colors.onSecondaryContainer,
      flexShrink: 1,
    },
    icon: {
      marginRight: 10,
    },
  });
};

export default memo(ReplyBox);
