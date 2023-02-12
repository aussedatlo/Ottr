import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import Input from '../../components/Input';
import { useUserContext } from '../../context/UserContext';
import RelayItem from './RelayItem';

const RelaysScreen = () => {
  const [newRelay, setNewRelay] = useState<string>('');
  const { relays, setRelays } = useUserContext();
  const [newRelays, setNewRelays] = useState<Array<string>>([]);

  useEffect(() => {
    setNewRelays(relays);
  }, [relays]);

  const onAdd = () => {
    if (relays.includes(newRelay)) {
      ToastAndroid.show('already configured', ToastAndroid.SHORT);
      return;
    }

    setNewRelays([newRelay, ...relays]);
    setNewRelay('');
  };

  const onDelete = (relay: string) => {
    setNewRelays(newRelays.filter((item) => item !== relay));
  };

  const onApply = () => {
    setRelays(newRelays);
    ToastAndroid.show('updated', ToastAndroid.SHORT);
  };

  const renderItemCallback = ({ item }: { item: string }) => (
    <RelayItem relay={item} onClose={onDelete} />
  );

  return (
    <View style={styles.root}>
      <Text variant="labelLarge" style={styles.title}>
        Configure desired relays
      </Text>
      <Input
        value={newRelay}
        placeholder="Add a relay"
        onChange={(e) => setNewRelay(e.nativeEvent.text)}
        right={<TextInput.Icon icon="plus" onPress={onAdd} />}
      />
      <FlatList
        data={newRelays}
        renderItem={renderItemCallback}
        style={styles.list}
      />
      <View style={styles.buttonContainer}>
        <Button
          icon="restart"
          mode="contained"
          style={styles.button}
          onPress={onApply}
        >
          Apply Configuration
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
  },
  list: {
    marginTop: 15,
  },
  button: {
    width: 200,
  },
  buttonContainer: {
    marginTop: 30,
    width: 200,
    alignSelf: 'center',
  },
});

export default RelaysScreen;
