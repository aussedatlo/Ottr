import React, { memo, useMemo } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Menu } from 'react-native-material-menu';
import { IconButton, useTheme } from 'react-native-paper';
import { Side } from '.';
import { Theme } from '../../providers/ThemeProvider';
import { Reaction } from '../../types/reaction';

type MenuMessageBoxProps = {
  visible: boolean;
  side: Side;
  pending: boolean;
  onChange: (visible: boolean) => void;
  onReply: () => void;
  onCopy: () => void;
  onReaction: (reaction: Reaction) => void;
};

const MenuMessageBox = ({
  visible,
  side,
  pending,
  onChange,
  onReply,
  onReaction,
  onCopy,
}: MenuMessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme, side), [theme, side]);

  const onNonImplemented = () => {
    ToastAndroid.show('Not implemented', ToastAndroid.SHORT);
  };

  return (
    <Menu
      visible={visible}
      onRequestClose={() => onChange(false)}
      anchor={<View />}
      style={styles.menu}
    >
      <View style={styles.container}>
        <IconButton
          size={20}
          icon="content-copy"
          onPress={onCopy}
          style={styles.button}
        />
        <IconButton
          size={20}
          icon="reply-outline"
          onPress={onReply}
          style={styles.button}
        />

        {side === 'right' ? (
          <IconButton
            size={20}
            icon="delete-outline"
            onPress={onNonImplemented}
            style={styles.button}
          />
        ) : (
          <></>
        )}

        {pending && side === 'right' ? (
          <IconButton
            size={20}
            icon="redo-variant"
            onPress={() => onChange(false)}
            style={styles.button}
          />
        ) : (
          <></>
        )}

        <IconButton
          size={20}
          icon="thumb-up-outline"
          onPress={() => onReaction('+')}
          style={styles.button}
        />

        <IconButton
          size={20}
          icon="thumb-down-outline"
          onPress={() => onReaction('-')}
          style={styles.button}
        />
      </View>
    </Menu>
  );
};

const createStyles = ({ colors }: Theme, side: Side) => {
  return StyleSheet.create({
    menu: {
      backgroundColor: colors.tertiaryContainer,
      borderRadius: 10,
      marginRight: 15,
      elevation: 2,
      alignSelf: side === 'right' ? 'flex-end' : 'flex-start',
      position: 'relative',
    },
    container: { flexDirection: 'row' },
    button: {
      margin: 0,
    },
  });
};

export default memo(MenuMessageBox);
