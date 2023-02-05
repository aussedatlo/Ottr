import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import { Theme } from '../../providers/ThemeProvider';

type ContactMessageBoxProps = {
  pubkey: string;
  content: string;
  time?: string;
};

const ContactMessageBox = ({
  pubkey,
  content,
  time,
}: ContactMessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Avatar pubkey={pubkey} size={40} />
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{content}</Text>
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
    root: { marginRight: 5, marginTop: 2 },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 5,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-start',
      borderRadius: 15,
      padding: 15,
      marginLeft: 5,
      maxWidth: '70%',
      backgroundColor: colors.secondary,
    },
    content: { color: colors.onPrimary },
    time: { alignSelf: 'flex-start', marginBottom: 10, marginLeft: 5 },
  });
};

export default memo(ContactMessageBox);
