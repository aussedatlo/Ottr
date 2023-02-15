import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Side } from '.';
import { Theme } from '../../providers/ThemeProvider';
import { Message } from '../../types/message';

type TimeIndicatorProps = {
  message: Message;
  nextMessage: Message;
  side: Side;
};

const TimeIndicator = ({ message, nextMessage, side }: TimeIndicatorProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme, side), [theme]);

  const nextMessageCreatedAt = new Date(
    nextMessage?.created_at * 1000,
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const currCreatedAt = new Date(message.created_at * 1000).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  if (
    nextMessageCreatedAt === currCreatedAt &&
    nextMessage.pubkey === message.pubkey
  )
    return;

  return (
    <Text variant="labelSmall" style={styles.time}>
      {currCreatedAt}
    </Text>
  );
};

const createStyles = ({ colors }: Theme, side: Side) => {
  return StyleSheet.create({
    time: {
      alignSelf: side === 'right' ? 'flex-end' : 'flex-start',
      margin: 10,
      marginTop: 0,
    },
  });
};

export default memo(TimeIndicator);
