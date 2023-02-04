import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import { observer } from 'mobx-react';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import Input from '../../components/Input';
import { RootStackParamList } from '../../navigation';
import { Theme } from '../../providers/ThemeProvider';
import { useStores } from '../../store';
import ContactBox from './ContactBox';

type SelectContactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SelectContact'
>;

const SelectContactScreen = observer(
  ({ navigation }: SelectContactScreenProps) => {
    const theme = useTheme<Theme>();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [text, setText] = useState('');
    const { contactStore } = useStores();

    const keys = useMemo(
      () =>
        contactStore.contactList
          .filter(
            (contact) =>
              contact.pubkey.includes(text) || contact.name?.includes(text),
          )
          .reduce((prev, curr) => [...prev, curr.pubkey], []),
      [contactStore.contactList, text],
    );

    const onStartConversation = () => {
      // TODO: verify format
      navigation.navigate('Talk', { pubkey: text });
    };

    const onPaste = async () => {
      const text = await Clipboard.getStringAsync();
      setText(text);
    };

    const renderItemCallback = ({ item }: { item: string }) => (
      <ContactBox key={item} pubkey={item} />
    );

    return (
      <View style={styles.root}>
        <Input
          value={text}
          style={styles.input}
          onChangeText={(text) => setText(text)}
          placeholder="public key or identifier"
          roundness={20}
          left={<TextInput.Icon size={20} icon={'magnify'} disabled />}
          right={
            <TextInput.Icon
              size={20}
              icon={'content-paste'}
              color={theme.colors.secondary}
              onPress={onPaste}
            />
          }
        />

        {text.length > 0 ? (
          <Button
            onPress={onStartConversation}
            mode="contained"
            style={styles.button}
          >
            Start new conversation
          </Button>
        ) : (
          <></>
        )}

        <FlatList data={keys} renderItem={renderItemCallback} />
      </View>
    );
  },
);

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      margin: 15,
    },
    button: {
      width: 200,
      marginBottom: 20,
      alignSelf: 'center',
    },
    input: {
      backgroundColor: colors.tertiaryContainer,
      borderRadius: 20,
      marginBottom: 20,
    },
  });
};

export default SelectContactScreen;
