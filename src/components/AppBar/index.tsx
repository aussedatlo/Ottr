import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import { useNostr } from 'nostr-react';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import {
  Appbar as AppBarPaper,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';
import { DEFAULT_RELAYS_URL } from '../../constant/relay';
import useProfile from '../../hooks/useProfile';
import { Theme } from '../../providers/ThemeProvider';
import { useStores } from '../../store';
import Avatar from '../Avatar';
import ModalController from '../Modal/ModalController';
import ShareKeyModal from '../Modal/ShareKeyModal';

const AppBar = observer(
  ({ navigation, back, route }: NativeStackHeaderProps) => {
    const theme = useTheme<Theme>();
    const { connectedRelays } = useNostr();
    const { userStore } = useStores();
    const { picture } = userStore.profile || { name: '', picture: '' };

    const params = route.params as { pubkey: string };
    const profile = useProfile(params?.pubkey);

    const getTitle = () => {
      switch (route.name) {
        case 'Home':
          return <Text>Ottr</Text>;
        case 'Talk':
          return (
            <View style={styles.appBarContainer}>
              <Avatar pubkey={params.pubkey} size={30} />
              <Text variant="titleLarge" style={styles.name}>
                {profile?.name || params.pubkey.slice(0, 8)}
              </Text>
            </View>
          );
        case 'SelectContact':
          return <Text>Select contact</Text>;
        default:
          return <Text>{route.name}</Text>;
      }
    };

    return (
      <AppBarPaper.Header>
        {back ? (
          <AppBarPaper.BackAction onPress={navigation.goBack} />
        ) : (
          <TouchableWithoutFeedback
            onPress={() =>
              ModalController.showModal('Public Key', <ShareKeyModal />)
            }
          >
            <View style={styles.avatar}>
              <Avatar pubkey={userStore.pubkey} picture={picture} size={30} />
            </View>
          </TouchableWithoutFeedback>
        )}

        <AppBarPaper.Content title={getTitle()} />
        {route.name === 'Home' ? (
          <>
            <AppBarPaper.Action
              icon="cog"
              onPress={() => navigation.navigate('SettingsNav')}
            />
          </>
        ) : (
          <></>
        )}

        <View>
          <IconButton
            icon="checkbox-multiple-marked-circle"
            iconColor={
              connectedRelays.length === DEFAULT_RELAYS_URL.length
                ? theme.colors.success
                : theme.colors.error
            }
          />
        </View>
      </AppBarPaper.Header>
    );
  },
);

const styles = StyleSheet.create({
  avatar: {
    marginRight: 10,
    marginLeft: 10,
  },
  appBarContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginLeft: 10,
  },
});

export default AppBar;
