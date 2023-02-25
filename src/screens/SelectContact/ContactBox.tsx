import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import { useUser } from '../../hooks/useUsers';
import { RootStackParamList } from '../../navigation';
import { Theme } from '../../providers/ThemeProvider';

type ContactBoxProps = {
  pubkey: string;
};

const ContactBox = ({ pubkey }: ContactBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useUser(pubkey);

  return (
    <Pressable
      onPress={() => navigate('Talk', { pubkey: pubkey })}
      android_ripple={{ color: theme.colors.backdrop }}
    >
      <View style={styles.root}>
        <Avatar pubkey={pubkey} picture={user?.picture} size={50} />
        <View style={styles.container}>
          <Text>{user?.name ? user.name : pubkey.slice(0, 8)}</Text>
          <Text variant="labelSmall" style={styles.label} numberOfLines={1}>
            {pubkey}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      margin: 10,
      marginLeft: 20,
      marginRight: 20,
    },
    container: {
      flexShrink: 1,
      marginLeft: 10,
      justifyContent: 'center',
    },
    label: {
      color: colors.tertiary,
    },
  });
};

export default memo(ContactBox);
