import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { memo, useMemo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
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
    <TouchableWithoutFeedback
      onPress={() => navigate('Talk', { pubkey: pubkey })}
    >
      <View style={styles.root}>
        <Avatar pubkey={pubkey} picture={user?.picture} size={50} />
        <View style={styles.container}>
          <Text>{user?.name ? user.name : pubkey.slice(0, 8)}</Text>
          <Text variant="labelSmall" style={styles.label}>
            {pubkey.slice(0, 30)}...
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      margin: 10,
    },
    container: {
      marginLeft: 10,
      justifyContent: 'center',
    },
    label: {
      color: colors.tertiary,
    },
  });
};

export default memo(ContactBox);
