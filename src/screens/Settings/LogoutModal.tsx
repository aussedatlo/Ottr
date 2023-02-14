import React from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import ModalController from '../../components/Modal/ModalController';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useUserContext } from '../../context/UserContext';

const LogoutModal = () => {
  const { logout } = useUserContext();
  const { logout: databaseLogout } = useDatabaseContext();

  const onLogout = async () => {
    try {
      ToastAndroid.show('logout', ToastAndroid.SHORT);
      await logout();
      await databaseLogout();
      ModalController.hideModal();
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
