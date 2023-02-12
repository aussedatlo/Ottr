import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import ModalController from '../../components/Modal/ModalController';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useUserContext } from '../../context/UserContext';

const LogoutModal = () => {
  const { database } = useDatabaseContext();
  const { logout } = useUserContext();
  const navigation = useNavigation();

  const onLogout = async () => {
    try {
      ToastAndroid.show('logout', ToastAndroid.SHORT);
      await AsyncStorage.clear();
      await database.reset();
      await logout();
      const action = StackActions.replace('Intro');
      ModalController.hideModal();
      navigation.dispatch(action);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.root}>
      <Text variant="titleSmall" style={styles.title}>
        Are you sure to logout ?
      </Text>
      <Text>Your private key will not be accessible again</Text>
      <Text>Make sure you saved it befor logout</Text>
      <Button
        mode="contained"
        style={styles.button}
        icon="logout"
        onPress={onLogout}
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 10,
    alignItems: 'center',
  },
  title: {
    margin: 5,
  },
  button: {
    marginTop: 20,
    width: 200,
  },
});

export default LogoutModal;
