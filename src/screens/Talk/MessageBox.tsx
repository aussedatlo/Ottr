import {
  notificationAsync,
  NotificationFeedbackType,
  selectionAsync,
} from 'expo-haptics';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Keyboard,
  Pressable,
  StyleSheet,
  Vibration,
  View,
} from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import {
  Avatar as AvatarPaper,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { Side } from '.';
import Avatar from '../../components/Avatar';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';
import { User } from '../../types/user';
import ReactionBox from './ReactionBox';

const renderLeftActions = (progress, dragX) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <RectButton>
      <Animated.View>
        <IconButton icon="reply-outline" style={{ opacity: trans }} />
      </Animated.View>
    </RectButton>
  );
};

type MessageBoxProps = {
  content: string;
  pending: boolean;
  reaction: Reaction;
  other_reaction: Reaction;
  user: User;
  side: Side;
  onMenu: (visible: boolean) => void;
  onReply: (ref: any) => void;
};

const MessageBox = ({
  content,
  pending,
  reaction,
  other_reaction,
  user,
  side,
  onMenu,
  onReply,
}: MessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme, side), [theme, side]);
  const swipeableRef = useRef(undefined);

  const onBoxLongPress = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => onMenu(true), 50);
  }, [onMenu]);

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={{ overflow: 'visible' }}
      renderLeftActions={side === 'left' ? renderLeftActions : undefined}
      renderRightActions={side === 'right' ? renderLeftActions : undefined}
      onSwipeableWillOpen={() => {
        selectionAsync();
        onReply(swipeableRef);
      }}
      onSwipeableWillClose={() => {
        // selectionAsync();
        // onReply(undefined);
      }}
      friction={5}
    >
      <View style={styles.root}>
        {side === 'left' ? (
          <Avatar picture={user.picture} pubkey={user.pubkey} size={35} />
        ) : (
          <></>
        )}
        <View style={styles.container}>
          <Pressable
            onLongPress={onBoxLongPress}
            android_ripple={{ color: theme.colors.backdrop }}
            style={styles.pressable}
          >
            <Text style={styles.content}>{content}</Text>
            {side === 'right' ? (
              <View style={styles.checkContainer}>
                <AvatarPaper.Icon
                  icon={'check-bold'}
                  size={12}
                  style={!pending ? styles.check : styles.hide}
                  color={theme.colors.primary}
                />
              </View>
            ) : (
              <></>
            )}
          </Pressable>
        </View>
        <ReactionBox
          reaction={reaction}
          other_reaction={other_reaction}
          side={side}
        />
      </View>
    </Swipeable>
  );
};

const createStyles = ({ colors }: Theme, side: Side) => {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: side === 'right' ? 'flex-end' : 'flex-start',
      paddingLeft: 5,
      paddingRight: 5,
    },
    avatar: {
      marginLeft: 5,
    },
    container: {
      overflow: 'hidden',
      padding: 0,
      maxWidth: '70%',
      marginBottom: 2,
      borderRadius: 15,
      marginLeft: 5,
      backgroundColor: side === 'right' ? colors.primary : colors.secondary,
    },
    pressable: {
      flexDirection: 'row',
      padding: 15,
    },
    content: {
      color: side === 'right' ? colors.onPrimary : colors.onSecondary,
      paddingRight: 8,
      flexShrink: 1,
    },
    checkContainer: {
      flexDirection: 'row',
      height: '100%',
      alignItems: 'flex-end',
    },
    check: {
      marginBottom: 3,
      backgroundColor: colors.primaryContainer,
    },
    hide: {
      marginBottom: 3,
      backgroundColor: colors.transparent,
      color: colors.transparent,
    },
  });
};

export default memo(MessageBox);
