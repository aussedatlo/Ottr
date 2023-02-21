import { useCallback, useMemo, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import BottomSheet from '../../components/BottomSheet';
import { useKeyboard } from '../../hooks/useKeyboard';
import { Theme } from '../../providers/ThemeProvider';
import { User } from '../../types/user';

type HeaderRightProps = {
  user: User;
};

const HeaderRight = ({ user }: HeaderRightProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [visible, setVisible] = useState<boolean>(false);
  const { open } = useKeyboard();

  const onAvatarPress = useCallback(() => {
    if (open) {
      Keyboard.dismiss();
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(true);
    }
  }, [visible, open]);

  return (
    <>
      <Pressable onPress={onAvatarPress}>
        <Avatar size={40} picture={user?.picture} pubkey={user?.pubkey} />
      </Pressable>

      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <View style={styles.container}>
          <Divider />
          <Avatar size={70} picture={user?.picture} pubkey={user?.pubkey} />
          <Text variant="titleSmall">
            {user?.name || user.pubkey.slice(0, 8)}
          </Text>
          <Text style={styles.about}>
            {user?.about || 'no description available'}
          </Text>
        </View>
      </BottomSheet>
    </>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    about: {
      margin: 10,
    },
  });
};

export default HeaderRight;
