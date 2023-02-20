import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useUserContext } from '../../context/UserContext';
import { useUser } from '../../hooks/useUsers';
import { RootStackParamList } from '../../navigation';
import { Message } from '../../types/message';
import InputSend from './InputSend';
import ListItem from './ListItem';
import ReplyInfo from './ReplyInfo';

export type Side = 'left' | 'right';

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, 'Talk'>;

const TalkScreen = ({ route, navigation }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const { pubkey: userPubkey } = useUserContext();
  const [reply, setReply] = useState<{ id: string; content: string }>(
    undefined,
  );
  const { allMessages } = useDatabaseContext();
  const user = useUser(pubkey);
  const messages = useMemo(
    () =>
      allMessages.filter(
        (m) => m.pubkey === pubkey || m.tags.toString().includes(pubkey),
      ),
    [allMessages, pubkey],
  );

  useEffect(() => {
    navigation.setOptions({
      title: user?.name ? user.name : pubkey.slice(0, 8),
    });
  }, [navigation, user, pubkey]);

  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const messageReplyId = item.tags.find((tag) => tag[0] === 'e')?.[1];
      const replyMessage = messages.find((m) => m.id === messageReplyId);
      const side = item.pubkey === userPubkey ? 'right' : 'left';

      return (
        <ListItem
          message={item}
          user={user}
          userPubkey={pubkey}
          nextMessage={messages?.[index - 1]}
          prevMessage={messages?.[index + 1]}
          replyMessage={replyMessage}
          side={side}
          setReply={setReply}
        />
      );
    },
    [messages, user, userPubkey],
  );

  return (
    <>
      <View style={styles.list}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          style={styles.scaleYInverted}
        />
      </View>

      <ReplyInfo
        replyContent={reply?.content}
        onCloseReply={() => setReply(undefined)}
      />
      <InputSend
        pubkey={pubkey}
        replyId={reply?.id}
        onCloseReply={() => setReply(undefined)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  scaleYInverted: {
    scaleY: -1,
  },
});

export default TalkScreen;
