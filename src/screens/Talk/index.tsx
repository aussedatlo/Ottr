import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useUser } from '../../hooks/useUsers';
import { RootStackParamList } from '../../navigation';
import { Message } from '../../types/message';
import Bottom from './Bottom';
import MessageBox from './MessageBox';

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, 'Talk'>;

const TalkScreen = ({ route, navigation }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const { allMessages } = useDatabaseContext();
  const messages = useMemo(
    () =>
      allMessages.filter(
        (m) => m.pubkey === pubkey || m.tags.toString().includes(pubkey),
      ),
    [allMessages, pubkey],
  );
  const user = useUser(pubkey);
  const messagesLengthRef = useRef(messages.length)

  useEffect(() => {
    navigation.setOptions({
      title: user?.name ? user.name : pubkey.slice(0, 8),
    });
  }, [navigation, user, pubkey]);

  const renderItem = ({ item, index }: { item: Message; index: number }) => (
    <MessageBox
      {...item}
      prevMessage={messages?.[index + 1]}
      nextMessage={messages?.[index - 1]}
      animate={index + messagesLengthRef.current < messages.length}
    />
  );

  return (
    <>
      <View style={styles.list}>
        <FlatList data={messages} renderItem={renderItem} inverted />
      </View>

      <Bottom pubkey={pubkey} />
    </>
  );
};

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
