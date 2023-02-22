import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
  const styles = useMemo(
    () => createStyles(theme, reaction && other_reaction ? 1 : 0),
    [theme, reaction, other_reaction],
  );

  if (!reaction && !other_reaction) return;

  return (
    <View style={[styles.root, side === 'right' ? styles.right : styles.left]}>
      {reaction ? (
        <Icon
          style={styles.reaction}
          name={getReactionIcon(reaction)}
          size={16}
        />
      ) : (
        <></>
      )}
      {other_reaction ? (
        <Icon
          style={styles.reaction}
          name={getReactionIcon(other_reaction)}
          size={16}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

const createStyles = ({ colors }: Theme, reactions: number) => {
  return StyleSheet.create({
    root: {
      position: 'absolute',
      bottom: -15,
      flexDirection: 'row',
      backgroundColor: colors.secondaryContainer,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.primaryContainer,
    },
    left: {
      right: 0 - reactions * 22,
    },
    right: { left: 0 - reactions * 22 },
    reaction: {
      color: colors.reaction,
      padding: 5,
    },
    other: {
      backgroundColor: colors.secondary,
      borderColor: colors.background,
      borderWidth: 1,
    },
  });
};

export default memo(ReactionBox);
