import React, { memo, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { Side } from '.';
import { Theme } from '../../providers/ThemeProvider';
import { Message } from '../../types/message';
import { getReactionIcon } from '../../utils/reactions';

type ReactionBoxProps = {
  message: Message;
  side: Side;
};

const ReactionBox = ({ message, side }: ReactionBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.root, side === 'right' ? styles.right : styles.left]}>
      {message.reaction ? (
        <Avatar.Icon
          style={styles.reaction}
          icon={getReactionIcon(message.reaction)}
          size={18}
        />
      ) : (
        <></>
      )}
      {message.other_reaction ? (
        <Avatar.Icon
          style={styles.other}
          icon={getReactionIcon(message.other_reaction)}
          size={18}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      position: 'absolute',
      bottom: -2,
      flexDirection: 'row',
    },
    left: {
      right: 10,
    },
    right: { left: 20 },
    reaction: {
      backgroundColor: colors.primary,
      borderColor: colors.background,
      borderWidth: 1,
    },
    other: {
      backgroundColor: colors.secondary,
      borderColor: colors.background,
      borderWidth: 1,
    },
  });
};

export default memo(ReactionBox);
