import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Avatar as AvatarPaper, Text, useTheme } from 'react-native-paper';
import { MenuState, Side } from '.';
import Avatar from '../../components/Avatar';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';
import { User } from '../../types/user';
import ReactionBox from './ReactionBox';

type MessageBoxProps = {
  id: string;
  content: string;
  pending: boolean;
  reaction: Reaction;
  other_reaction: Reaction;
  user: User;
  side: Side;
  onMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  animate: boolean;
};

const MessageBox = ({
  id,
  content,
  pending,
  reaction,
  other_reaction,
  user,
  side,
  onMenu,
  animate,
}: MessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme, side), [theme, side]);

  const anim = useRef(new Animated.Value(0));

  useEffect(() => {
    if (!animate) return;

    console.log('start animations');
    Animated.timing(anim.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start(() => console.log('DONE'));
  }, []);

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
        other_reaction={other_reaction}
        side={side}
      />
    </Animated.View>
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
