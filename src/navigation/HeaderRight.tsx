import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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
  const { pool } = useNostrContext();
  const theme = useTheme<Theme>();
  const { colors } = theme;
  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [visible, setVisible] = useState<boolean>(false);

  const poolConnexions = pool._conn;

  const connectedRelaysUrl = Object.keys(poolConnexions).reduce(
    (prev: string[], curr: string) =>
      poolConnexions[curr].status === 1 ? [...prev, curr] : prev,
    [],
  );

  const relaysUrl = relays.sort((a) =>
    !connectedRelaysUrl.includes(a) ? 1 : -1,
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
