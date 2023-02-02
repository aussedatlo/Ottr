import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Observer } from 'mobx-react';
import { generatePrivateKey } from 'nostr-tools';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { RootStackParamList } from '../navigation';
import { useStores } from '../store';

type IntroScreenProps = NativeStackScreenProps<RootStackParamList, 'Intro'>;

const IntroScreen = ({ navigation }: IntroScreenProps) => {
  const { userStore } = useStores();

  const handleNewKey = () => {
    userStore.setKey(generatePrivateKey());
    navigation.navigate('Home');
  };

  return (
    <Observer>
      {() => (
        <View>
          <Text>Welcome to ANostr</Text>
          <Text>An android app to suf on nostr protocol!</Text>

          <Button mode="contained" style={styles.button} onPress={handleNewKey}>
            Generate a new key
          </Button>
        </View>
      )}
    </Observer>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 200,
  },
});

export default IntroScreen;
