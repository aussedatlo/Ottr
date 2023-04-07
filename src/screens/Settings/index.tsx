import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text } from 'react-native-paper';
import ModalController from '../../components/Modal/ModalController';
import { SettingsStackParamList } from '../../navigation/SettingsNavigation';
import ButtonSettings from './ButtonSettings';
import LogoutModal from './LogoutModal';
import SelectThemeModal from './SelectThemeModal';

type SelectContactScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'Settings'
>;

const SettingsScreen = ({ navigation }: SelectContactScreenProps) => {
  return (
    <View>
      <Text variant="labelMedium" style={styles.title}>
        Account settings
      </Text>
      <ButtonSettings
        icon="account-edit"
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Divider />
      <ButtonSettings
        icon="shield-key"
        title="Key"
        onPress={() => navigation.navigate('Key')}
      />
      <Divider />
      <ButtonSettings
        icon="cellphone-off"
        title="Logout"
        onPress={() => ModalController.showModal('Logout', <LogoutModal />)}
      />
      <Divider />
      <Text variant="labelMedium" style={styles.title}>
        App settings
      </Text>
      <ButtonSettings
        icon="brightness-4"
        title="Theme"
        onPress={() => ModalController.showModal('Theme', <SelectThemeModal />)}
      />
      <Divider />
      <ButtonSettings
        icon="server-network"
        title="Relays"
        onPress={() => navigation.navigate('Relays')}
      />
      <Divider />
      <Text variant="labelMedium" style={styles.title}>
        App information
      </Text>
      <ButtonSettings
        icon="information"
        title="About"
        onPress={() => {
          console.log('pressed');
        }}
      />
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 3,
  },
});

export default SettingsScreen;
