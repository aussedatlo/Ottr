import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import { RootStackParamList } from '../../navigation';
import { useStores } from '../../store';
import ContactBox from './ContactBox';

type SelectContactScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'SelectContact'
>;

const SelectContactScreen = observer(
  ({ navigation }: SelectContactScreenProps) => {
    const [text, setText] = useState('');
    const { messageStore } = useStores();
    const keys = messageStore.messageList?.keys();

    const onStartConversation = () => {
      // TODO: verify format
      navigation.navigate('Talk', { pubkey: text });
    };

    const renderItemCallback = useCallback(
      ({ item }: { item: string }) => <ContactBox key={item} pubkey={item} />,
      [],
    );

    return (
      <View style={styles.root}>
        <Searchbar
          placeholderTextColor="#9B979C"
          selectionColor="#CFBCFF"
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="public key or identifier"
        />

        <Button onPress={onStartConversation}>Start a conversation</Button>

        <FlatList data={[...keys]} renderItem={renderItemCallback} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  button: {
    margin: 15,
    marginBottom: 25,
  },
});

export default SelectContactScreen;
