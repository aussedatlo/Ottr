import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar as AvatarPaper, Text, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

type UserMessageBoxProps = {
  content: string;
  pending: boolean;
  time?: string;
};

const UserMessageBox = ({ content, pending, time }: UserMessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.root}>
      <View style={styles.contentContainer}>
        <Text style={styles.content}>{content}</Text>
        <View style={styles.avatarContainer}>
          <AvatarPaper.Icon
            icon={'check-bold'}
            size={12}
            style={!pending ? styles.avatar : styles.hide}
            color={theme.colors.primary}
          />
        </View>
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
    root: {
      marginRight: 5,
      marginTop: 2,
      maxWidth: '70%',
      alignSelf: 'flex-end',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      borderRadius: 15,
      padding: 15,
      paddingRight: 10,
      backgroundColor: colors.primary,
    },
    content: { color: colors.onPrimary, paddingRight: 8 },
    avatarContainer: {
      flexDirection: 'row',
      height: '100%',
      alignItems: 'flex-end',
    },
    avatar: {
      marginBottom: 3,
      backgroundColor: colors.primaryContainer,
    },
    hide: {
      marginBottom: 3,
      backgroundColor: colors.primary,
    },
    time: { alignSelf: 'flex-end', marginBottom: 10, marginRight: 5 },
  });
};

export default memo(UserMessageBox);
