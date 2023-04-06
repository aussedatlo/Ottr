import { generatePrivateKey } from 'nostr-tools';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Icon from '../../assets/icon.svg';
import { useUserContext } from '../context/UserContext';

const IntroScreen = () => {
  const { setKey } = useUserContext();
  const animLogo = useRef(new Animated.Value(0));
  const animTitle = useRef(new Animated.Value(0));
  const animButtons = useRef(new Animated.Value(0));

  const handleNewKey = () => {
    setKey(generatePrivateKey());
  };

  useEffect(() => {
    Animated.timing(animLogo.current, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.exp),
    }).start(() =>
      Animated.timing(animTitle.current, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start(() =>
        Animated.timing(animButtons.current, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(),
      ),
    );
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.icon,
          {
            transform: [
              {
                translateY: animLogo.current.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -150],
                }),
              },
            ],
          },
        ]}
      >
        <Icon width={250} height={250} />
      </Animated.View>
      <Animated.View
        style={[
          styles.root,
          {
            opacity: animTitle.current,
            translateY: animTitle.current.interpolate({
              inputRange: [0, 1],
              outputRange: [150, 100],
            }),
          },
        ]}
      >
        <Text variant="headlineMedium">Welcome to Ottr</Text>
        <Text variant="labelLarge">
          Private messenger, end-to-end encrypted,
        </Text>
        <Text variant="labelLarge" style={styles.label}>
          based on nostr protocol
        </Text>

        <Animated.View
          style={[
            styles.icon,
            {
              opacity: animButtons.current,
              translateY: animButtons.current.interpolate({
                inputRange: [0, 1],
                outputRange: [200, 150],
              }),
            },
          ]}
        >
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
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    position: 'absolute',
    alignSelf: 'center',
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
