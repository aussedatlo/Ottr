import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { RootStackParamList } from '../../navigation';
import { useStores } from '../../store';
import ContactMessageBox from './ContactMessageBox';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = observer(({ navigation }: HomeScreenProps) => {
  const { messageStore } = useStores();
  const keys = messageStore.messageList?.keys();

  const renderItem = ({ item }: { item: string }) => (
    <ContactMessageBox pubkey={item} key={item} />
  );

  return (
    <View style={styles.root}>
      <SafeAreaView>
        <FlatList
          data={[...keys]}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          style={{ height: ' 100%' }}
        />
      </SafeAreaView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('SelectContact')}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
