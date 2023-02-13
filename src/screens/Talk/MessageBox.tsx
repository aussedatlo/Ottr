import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { useUserContext } from '../../context/UserContext';
import { Theme } from '../../providers/ThemeProvider';
import { Message } from '../../types/message';
import ContactMessageBox from './ContactMessageBox';
import UserMessageBox from './UserMessageBox';

type MessageProps = Message & {
  prevMessage: Message;
  nextMessage: Message;
  animate: boolean;
};

const MessageBox = (props: MessageProps) => {
  const {
    content,
    created_at,
    pending,
    pubkey,
    prevMessage,
    nextMessage,
    animate,
  } = props;
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { pubkey: userPubkey } = useUserContext();
  const animation = useRef(animate ? new Animated.Value(150) : new Animated.Value(0));

  useEffect(() => {

    console.log(animate)
    console.log(content)
    if (!animate) return;
    Animated.timing(animation.current, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      animation.current = new Animated.Value(0);
      //If you remove above line then it will stop the animation at toValue point
    });
  }, [animate, animation]);

  const prevMessageDate = prevMessage
    ? new Date(prevMessage.created_at * 1000).toLocaleDateString()
    : undefined;
  const currMessageDate = new Date(created_at * 1000).toLocaleDateString();

  const nextMessageCreatedAt = nextMessage
    ? new Date(nextMessage.created_at * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date();
  const currCreatedAt = new Date(created_at * 1000).toLocaleTimeString(
    'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  );

  return (
    <View>
      {prevMessageDate === undefined || prevMessageDate !== currMessageDate ? (
        <View>
          <Divider style={styles.divider} />
          <Text variant="labelSmall" style={styles.date}>
            {currMessageDate}
          </Text>
        </View>
      ) : (
        <></>
      )}

      <Animated.View
        style={{
          transform: [
            {
              translateX: animation.current,
            },
          ],
        }}
      >
        {userPubkey === pubkey ? (
          <UserMessageBox
            content={content}
            pending={pending}
            time={
              currCreatedAt !== nextMessageCreatedAt || !(userPubkey === pubkey)
                ? currCreatedAt
                : undefined
            }
          />
        ) : (
          <ContactMessageBox
            pubkey={pubkey}
            content={content}
            time={
              currCreatedAt !== nextMessageCreatedAt || userPubkey === pubkey
                ? currCreatedAt
                : undefined
            }
          />
        )}
      </Animated.View>
    </View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    divider: {
      marginLeft: 50,
      marginRight: 50,
      marginTop: 10,
    },
    date: {
      alignSelf: 'center',
      marginTop: 5,
      color: colors.onSurfaceDisabled,
    },
  });
};

export default memo(MessageBox);
