import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Side } from '.';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';
import { getReactionIcon } from '../../utils/reactions';

type ReactionBoxProps = {
  reaction: Reaction;
  otherReaction: Reaction;
  side: Side;
};

const ReactionBox = ({ reaction, otherReaction, side }: ReactionBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(
    () => createStyles(theme, reaction && otherReaction ? 1 : 0),
    [theme, reaction, otherReaction],
  );

  if (!reaction && !otherReaction) return;

  return (
    <View style={[styles.root, side === 'right' ? styles.right : styles.left]}>
      {reaction ? (
        <Icon
          style={styles.reaction}
          name={getReactionIcon(reaction)}
          size={12}
        />
      ) : (
        <></>
      )}
      {otherReaction ? (
        <Icon
          style={styles.reaction}
          name={getReactionIcon(otherReaction)}
          size={12}
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
      bottom: -12,
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
      padding: 4,
    },
    other: {
      backgroundColor: colors.secondary,
      borderColor: colors.background,
      borderWidth: 1,
    },
  });
};

export default memo(ReactionBox);
