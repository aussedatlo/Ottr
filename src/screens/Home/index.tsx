import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { RootStackParamList } from '../../navigation';
import { Theme } from '../../providers/ThemeProvider';
import { User } from '../../types/user';
import ContactMessageBox from './ContactMessageBox';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { allUsers } = useDatabaseContext();

  const renderItem = ({ item }: { item: string }) => (
    <ContactMessageBox pubkey={item} key={item} />
  );

  const keys = useMemo(
    () =>
      allUsers?.reduce(
        (prev: Array<string>, curr: User) => [...prev, curr.pubkey],
        [],
      ),
    [allUsers],
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={keys}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        style={styles.list}
      />

      <FAB
        icon="pencil"
        style={styles.fab}
        color={theme.colors.onPrimary}
        onPress={() => navigation.navigate('SelectContact')}
      />
    </View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      margin: 15,
    },
    list: {
      height: '100%',
    },
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
      backgroundColor: colors.primary,
      color: colors.onPrimary,
      borderRadius: 15,
    },
  });
};

export default HomeScreen;
