import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { Side } from '.';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';
import { getReactionIcon } from '../../utils/reactions';

type ReactionBoxProps = {
  reaction: Reaction;
  other_reaction: Reaction;
  side: Side;
};

const ReactionBox = ({ reaction, other_reaction, side }: ReactionBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.root, side === 'right' ? styles.right : styles.left]}>
      {reaction ? (
        <Avatar.Icon
          style={styles.reaction}
          icon={getReactionIcon(reaction)}
          size={18}
        />
      ) : (
        <></>
      )}
      {other_reaction ? (
        <Avatar.Icon
          style={styles.other}
          icon={getReactionIcon(other_reaction)}
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
