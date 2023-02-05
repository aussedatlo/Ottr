import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import useProfile from '../../hooks/useProfile';
import { RootStackParamList } from '../../navigation';
import { useStores } from '../../store';
import { Message } from '../../types/message';
import Bottom from './Bottom';
import MessageBox from './MessageBox';

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, 'Talk'>;

const TalkScreen = observer(({ route, navigation }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const profile = useProfile(pubkey);
  const { messageStore } = useStores();
  const messageList = messageStore.messageList.get(pubkey);

  useEffect(() => {
    navigation.setOptions({
      title: profile && profile.name ? profile.name : pubkey.slice(0, 8),
    });
  }, [navigation, profile, pubkey]);

  // Update component when messages status is updated
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const messagesNotSend: Array<Message> =
    messageList?.length > 0
      ? messageList.filter((message) => !message.isSend)
      : [];

  const renderItem = ({ item }) => <MessageBox {...item} />;

  return (
    <>
      <View style={styles.list}>
        <FlatList
          data={messageList?.slice().reverse()}
          renderItem={renderItem}
          inverted
        />
      </View>

      <Bottom pubkey={pubkey} />
    </>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  list: {
    flex: 1,
  },
  bottom: {
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default TalkScreen;
