import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { SettingsStackParamList } from '../../navigation/SettingsNavigation';
import ButtonSettings from './ButtonSettings';

type SelectContactScreenProps = NativeStackScreenProps<
  SettingsStackParamList,
  'Settings'
>;

const SettingsScreen = ({ route, navigation }: SelectContactScreenProps) => {
  return (
    <View>
      <ButtonSettings
        icon="account-circle-outline"
        title="Profile"
        onPress={() => navigation.navigate('Profile')}
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
        onPress={() => {}}
      />
    </View>
  );
};

export default SettingsScreen;
