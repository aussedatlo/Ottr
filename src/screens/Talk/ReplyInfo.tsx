import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Avatar, IconButton, Text, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

type ReplyInfoProps = {
  onCloseReply: () => void;
  replyContent?: string;
};

const ReplyInfo = ({ replyContent, onCloseReply }: ReplyInfoProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const anim = useRef(new Animated.Value(0));

  useEffect(() => {
    if (!replyContent) {
      Animated.timing(anim.current, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(anim.current, {
      toValue: 100,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [replyContent]);

  if (!replyContent) return <></>;

  return (
    <Animated.View
      style={[
        styles.root,
        {
          transform: [
            {
              scaleY: anim.current.interpolate({
                inputRange: [0, 100],
                outputRange: [0, 1],
              }),
            },
            {
              scaleX: anim.current.interpolate({
                inputRange: [0, 100],
                outputRange: [0.8, 1],
              }),
            },
          ],
          opacity: anim.current.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
          }),
        },
      ]}
    >
      <Avatar.Icon icon="reply-outline" size={20} style={styles.icon} />
      <Text style={styles.text} numberOfLines={1}>
        {replyContent}
      </Text>
      <IconButton
        icon="close"
        size={20}
        onPress={onCloseReply}
        style={styles.close}
      />
    </Animated.View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      alignItems: 'center',
      flexDirection: 'row',
      margin: 10,
      marginBottom: 0,
      borderRadius: 20,
      backgroundColor: colors.secondaryContainer,
      paddingLeft: 10,
      paddingRight: 10,
    },
    icon: {
      marginRight: 10,
    },
    text: { flex: 1 },
    close: {
      margin: 0,
    },
  });
};

export default ReplyInfo;
