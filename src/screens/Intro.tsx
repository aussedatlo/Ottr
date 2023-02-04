import { StackActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import { generatePrivateKey } from 'nostr-tools';
import React, { useEffect } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from '../../assets/icon.svg';
import { RootStackParamList } from '../navigation';
import { useStores } from '../store';

type IntroScreenProps = NativeStackScreenProps<RootStackParamList, 'Intro'>;

const IntroScreen = observer(({ navigation }: IntroScreenProps) => {
  const { userStore } = useStores();

  const handleNewKey = () => {
    userStore.setKey(generatePrivateKey());
    const action = StackActions.replace('Home');
    navigation.dispatch(action);
  };

  return (
    <View style={styles.root}>
      <Icon width={200} height={300} style={styles.icon} />
      <Text variant="headlineMedium">Welcome to Ottr</Text>
      <Text variant="labelLarge">Private messenger, end-to-end encrypted,</Text>
      <Text variant="labelLarge" style={styles.label}>
        based on nostr protocol
      </Text>

      <Button
        icon="key"
        mode="contained"
        style={styles.button}
        onPress={handleNewKey}
      >
        Generate a new key
      </Button>
      <Button
        icon="import"
        mode="contained"
        style={styles.button}
        onPress={() =>
          ToastAndroid.show('not implemented yet', ToastAndroid.SHORT)
        }
      >
        Import existing key
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 50,
  },
  label: {
    marginBottom: 30,
  },
  button: {
    marginTop: 10,
    width: 200,
  },
});

export default IntroScreen;
