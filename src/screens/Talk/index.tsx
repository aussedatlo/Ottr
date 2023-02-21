import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useUserContext } from '../../context/UserContext';
import { useUser } from '../../hooks/useUsers';
import { RootStackParamList } from '../../navigation';
import { Theme } from '../../providers/ThemeProvider';
import { Message } from '../../types/message';
import HeaderRight from './HeaderRight';
import InputSend from './InputSend';
import ListItem from './ListItem';
import ReplyInfo from './ReplyInfo';

export type Side = 'left' | 'right';

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, 'Talk'>;

const TalkScreen = ({ route, navigation }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const { pubkey: userPubkey } = useUserContext();
  const { allMessages } = useDatabaseContext();
  const { colors } = useTheme<Theme>();
  const user = useUser(pubkey);
  const [reply, setReply] = useState<{ id: string; content: string }>(
    undefined,
  );

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
      headerRight: () => <HeaderRight user={user} />,
    });
  }, [colors, navigation, user, pubkey]);

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
    [messages, user, userPubkey, pubkey],
  );

  return (
    <>
      <View style={styles.list}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          style={styles.scaleYInverted}
          keyboardShouldPersistTaps="handled"
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
