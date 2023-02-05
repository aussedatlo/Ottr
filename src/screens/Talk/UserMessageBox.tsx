import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar as AvatarPaper, Text, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

type UserMessageBoxProps = {
  content: string;
  isSend: boolean;
  time?: string;
};

const UserMessageBox = ({ content, isSend, time }: UserMessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{content}</Text>
        <AvatarPaper.Icon
          icon={'check-bold'}
          size={12}
          style={isSend ? styles.avatar : styles.hide}
          color={theme.colors.primary}
        />
      </View>
      {time ? (
        <Text variant="labelSmall" style={styles.time}>
          {time}
        </Text>
      ) : (
        <></>
      )}
    </View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: { marginRight: 5, marginTop: 2 },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      borderRadius: 15,
      padding: 15,
      maxWidth: '70%',
      backgroundColor: colors.primary,
    },
    content: { color: colors.onPrimary },
    avatar: {
      backgroundColor: colors.primaryContainer,
      marginLeft: 5,
    },
    hide: {
      backgroundColor: colors.primary,
      marginLeft: 5,
    },
    time: { alignSelf: 'flex-end', marginBottom: 10, marginRight: 5 },
  });
};

export default memo(UserMessageBox);
