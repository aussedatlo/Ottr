import * as Clipboard from 'expo-clipboard';
import { generatePrivateKey, getPublicKey } from 'nostr-tools';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import SvgQRCode from 'react-native-qrcode-svg';
import Input from '../../components/Input';
import { useUserContext } from '../../context/UserContext';

type KeyScreenState = {
  key: string;
  pubkey: string;
};

const KeyScreen = () => {
  const { key, pubkey, setKey } = useUserContext();
  const [state, setState] = useState<KeyScreenState>({
    key: '',
    pubkey: '',
  });
  const [displayKey, setDisplayKey] = useState<boolean>(false);

  useEffect(() => {
    setState(() => ({ key: key, pubkey: pubkey }));
  }, [key, pubkey]);

  const onCopy = async () => {
    await Clipboard.setStringAsync(pubkey);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  };

  const onUpdateKey = () => {
    try {
      getPublicKey(state.key);
      setKey(state.key);
      ToastAndroid.show('Key updated', ToastAndroid.SHORT);
      setDisplayKey(false);
    } catch (e) {
      ToastAndroid.show('Invalid key format', ToastAndroid.SHORT);
    }
  };

  const onNewKey = () => {
    setDisplayKey(false);
    setKey(generatePrivateKey());
  };

  return (
    <View style={styles.root}>
      <SvgQRCode value={pubkey} size={280} />
      <Text variant="labelMedium" style={styles.pubkey}>
        {pubkey}
      </Text>

      <Button
        icon="clipboard"
        mode="contained"
        style={styles.button}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onPress={onCopy}
      >
        Copy public key
      </Button>

      {!displayKey ? (
        <Button
          icon="key"
          mode="contained"
          style={styles.button}
          onPress={() => setDisplayKey(true)}
        >
          Edit private key
        </Button>
      ) : (
        <View style={styles.container}>
          <Input
            value={state.key}
            placeholder="private key"
            onChange={(e) => setState({ ...state, key: e.nativeEvent.text })}
            multiline
            numberOfLines={2}
          />
          <Button
            icon="key"
            mode="contained"
            style={styles.button}
            onPress={onUpdateKey}
          >
            Update private key
          </Button>
          <Button
            icon="pencil-outline"
            mode="contained"
            style={styles.button}
            onPress={onNewKey}
          >
            New private key
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pubkey: {
    marginTop: 10,
    width: 280,
    marginBottom: 20,
  },
  button: {
    width: 200,
    margin: 10,
  },
  container: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KeyScreen;
