import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { SettingsStackParamList } from '../../navigation/SettingsNavigation';
import ButtonSettings from './ButtonSettings';
import ModalController from '../../components/Modal/ModalController';
import SelectThemeModal from './SelectThemeModal';

type SelectContactScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'Settings'
>;

const SettingsScreen = ({ navigation }: SelectContactScreenProps) => {
  return (
    <View>
      <ButtonSettings
        icon="account-circle-outline"
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <ButtonSettings
        icon="theme-light-dark"
        title="Theme"
        onPress={() => ModalController.showModal('Theme', <SelectThemeModal />)}
      />
      <ButtonSettings
        icon="lan"
        title="Relays"
        onPress={() => navigation.navigate('Relays')}
      />
      <ButtonSettings
        icon="shield-key-outline"
        title="Key"
        onPress={() => navigation.navigate('Key')}
      />
      <ButtonSettings
        icon="information-outline"
        title="About"
        onPress={() => {
          console.log('pressed');
        }}
      />
    </View>
  );
};

export default SettingsScreen;
