import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useMemo } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Avatar from '../../components/Avatar';
import { RootStackParamList } from '../../navigation';
import { Theme } from '../../providers/ThemeProvider';
import { useStores } from '../../store';

type ContactMessageBoxProps = {
  pubkey: string;
};

const ContactMessageBox = observer(({ pubkey }: ContactMessageBoxProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { contactStore, messageStore } = useStores();
  const contact = contactStore.contactList.find(
    (contact) => contact.pubkey === pubkey,
  );
  const name = contact?.name || pubkey.substring(0, 8);
  const messageList = messageStore.messageList.get(pubkey);
  const lastMessage = messageList[messageList?.length - 1];

  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigate('Talk', { pubkey: pubkey })}
    >
      <View style={styles.root}>
        <Avatar pubkey={pubkey} size={50} />
        <View style={styles.container}>
          <Text>{name ? name : pubkey.slice(0, 8)}</Text>
          <Text
            variant="labelSmall"
            style={styles.secondary}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {lastMessage.content}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
});

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      marginTop: 5,
      marginBottom: 5,
    },
    container: {
      flex: 1,
      marginLeft: 15,
      justifyContent: 'center',
    },
    secondary: {
      color: colors.onSurfaceDisabled,
    },
  });
};

export default ContactMessageBox;
