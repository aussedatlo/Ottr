import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import SvgQRCode from 'react-native-qrcode-svg';
import { useUserContext } from '../../context/UserContext';

const ShareKeyModal = () => {
  const { pubkey } = useUserContext();

  const onCopy = async () => {
    await Clipboard.setStringAsync(pubkey);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
  };

  return (
    <View style={styles.root}>
      <SvgQRCode value={pubkey} size={250} />
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
        Copy
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 30,
  },
  pubkey: {
    marginTop: 10,
    width: 250,
  },
  button: {
    marginTop: 20,
  },
});

export default ShareKeyModal;
