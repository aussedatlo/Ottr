import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Relay } from 'nostr-tools';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '.';
import BottomSheet from '../components/BottomSheet';
import { useNostrContext } from '../context/NostrContext';
import { useUserContext } from '../context/UserContext';
import { Theme } from '../providers/ThemeProvider';

const HeaderRight = () => {
  const { relays } = useUserContext();
  const { connectedRelays } = useNostrContext();
  const theme = useTheme<Theme>();
  const { colors } = theme;
  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState<boolean>(false);

  const connectedRelaysUrl: string[] = useMemo(
    () =>
      connectedRelays.reduce(
        (prev: string[], curr: Relay) => [...prev, curr.url],
        [],
      ),
    [connectedRelays],
  );

  const relaysUrl = useMemo(
    () => relays.sort((a) => (!connectedRelaysUrl.includes(a) ? 1 : -1)),
    [connectedRelaysUrl],
  );

  return (
    <>
      <IconButton icon="cog" onPress={() => navigate('SettingsNav')} />
      <IconButton
        icon="checkbox-multiple-marked-circle"
        iconColor={
          connectedRelaysUrl.length === relays?.length
            ? colors.success
            : connectedRelaysUrl.length === 0
            ? colors.error
            : colors.warning
        }
        onPress={() => setVisible(true)}
      />
      <BottomSheet visible={visible} onClose={() => setVisible(false)}>
        <>
          {relaysUrl.map((relay: string) => (
            <View key={relay} style={styles.relays}>
              <Text variant="titleSmall" style={styles.text} numberOfLines={1}>
                {relay}
              </Text>
              {connectedRelaysUrl.includes(relay) ? (
                <Chip
                  icon={() => (
                    <Icon
                      name="checkbox-marked-circle"
                      size={20}
                      color={colors.success}
                    />
                  )}
                  style={styles.chip}
                >
                  connected
                </Chip>
              ) : (
                <Chip
                  icon={() => (
                    <Icon name="alert-circle" size={20} color={colors.error} />
                  )}
                  style={styles.chip}
                >
                  disconnected
                </Chip>
              )}
            </View>
          ))}
        </>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  relays: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, flexShrink: 1 },
  chip: { margin: 5 },
});

export default HeaderRight;
