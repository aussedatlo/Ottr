import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import {
  Avatar as AvatarPaper,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { MenuState, Reply, Side } from '.';
import Avatar from '../../components/Avatar';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';
import ReactionBox from './ReactionBox';

const renderLeftActions = (progress) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-1, 1],
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
  id: string;
  content: string;
  pending: boolean;
  reaction: Reaction;
  otherReaction: Reaction;
  otherPubkey: string;
  otherPicture: string;
  side: Side;
  onMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  onReply: React.Dispatch<React.SetStateAction<Reply>>;
  animate: boolean;
};

const MessageBox = ({
  id,
  content,
  pending,
  reaction,
  otherReaction,
  otherPubkey,
  otherPicture,
  side,
  onMenu,
  onReply,
  animate,
}: MessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme, side), [theme, side]);
  const swipe = useRef(null);

  const anim = useRef(new Animated.Value(0));

  useEffect(() => {
    if (!animate) return;

    Animated.timing(anim.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [animate]);

  const onBoxLongPress = useCallback(
    (event: GestureResponderEvent) => {
      Keyboard.dismiss();
      setTimeout(
        () =>
          event.target?.measure((x, y, width, height, pageX, pageY) => {
            onMenu((oldState: MenuState) => ({
              ...oldState,
              anchor: {
                x: side === 'right' ? x + pageX + width : x + pageX - width,
                y: y + pageY + height,
              },
              visible: true,
              messageContent: content,
              messageId: id,
              pending: pending,
              side: side,
            }));
          }),
        50,
      );
    },
    [onMenu, content, id, side, pending],
  );

  return (
    <Swipeable
      ref={swipe}
      containerStyle={{ overflow: 'visible' }}
      renderLeftActions={side === 'left' ? renderLeftActions : undefined}
      renderRightActions={side === 'right' ? renderLeftActions : undefined}
      onSwipeableWillOpen={() => {
        onReply({ id: id, content: content });
        setTimeout(() => swipe.current.close(), 10);
      }}
      friction={5}
      maxPointers={1}
    >
      <Animated.View
        style={[
          styles.root,
          animate
            ? {
                transform: [
                  {
                    scale: anim.current,
                  },
                ],
              }
            : {},
        ]}
      >
        {side === 'left' ? (
          <Avatar picture={otherPicture} pubkey={otherPubkey} size={35} />
        ) : (
          <></>
        )}
        <View style={styles.container}>
          <Pressable
            onLongPress={onBoxLongPress}
            android_ripple={{ color: theme.colors.backdrop }}
            style={styles.pressable}
          >
            <View pointerEvents="none" style={{ flexDirection: 'row' }}>
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
            </View>
          </Pressable>
        </View>
        <ReactionBox
          reaction={reaction}
          otherReaction={otherReaction}
          side={side}
        />
      </Animated.View>
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
