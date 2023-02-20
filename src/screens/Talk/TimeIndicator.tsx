import React, { memo, useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Side } from '.';
import { Message } from '../../types/message';

type TimeIndicatorProps = {
  createdAt: number;
  nextCreatedAt: number;
  pubkey: string;
  nextPubkey: string;
  side: Side;
};

const TimeIndicator = ({
  createdAt,
  nextCreatedAt,
  pubkey,
  nextPubkey,
  side,
}: TimeIndicatorProps) => {
  const styles = useMemo(() => createStyles(side), [side]);

  const nextMessageCreatedAt = new Date(
    nextCreatedAt * 1000,
  ).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const currCreatedAt = new Date(createdAt * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (nextMessageCreatedAt === currCreatedAt && nextPubkey === pubkey) return;

  return (
    <Text variant="labelSmall" style={styles.time}>
      {currCreatedAt}
    </Text>
  );
};

const createStyles = (side: Side) => {
  return StyleSheet.create({
    time: {
      alignSelf: side === 'right' ? 'flex-end' : 'flex-start',
      margin: 10,
      marginTop: 0,
    },
  });
};

export default memo(TimeIndicator);
