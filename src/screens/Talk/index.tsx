import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDatabaseContext } from '../../context/DatabaseContext';
import { useUserContext } from '../../context/UserContext';
import { useUser } from '../../hooks/useUsers';
import { RootStackParamList } from '../../navigation';
import { Message } from '../../types/message';
import HeaderRight from './HeaderRight';
import InputSend from './InputSend';
import ListItem from './ListItem';
import MenuMessageBox from './Menu';
import ReplyInfo from './ReplyInfo';

export type Side = 'left' | 'right';

export type Reply = { id: string; content: string };

export type MenuState = {
  visible: boolean;
  anchor: { x: number; y: number };
  messageId: string;
  messageContent: string;
  otherPubkey: string;
  pending: boolean;
  side: Side;
};

type TalkScreenProps = NativeStackScreenProps<RootStackParamList, 'Talk'>;

const TalkScreen = ({ route, navigation }: TalkScreenProps) => {
  const pubkey = route.params.pubkey;
  const { pubkey: userPubkey } = useUserContext();
  const { allMessages } = useDatabaseContext();
  const user = useUser(pubkey);

  const [reply, setReply] = useState<Reply>(undefined);
  const [menuState, setMenuState] = useState<MenuState>({
    visible: false,
    anchor: { x: 0, y: 0 },
    messageId: undefined,
    messageContent: undefined,
    otherPubkey: pubkey,
    pending: false,
    side: undefined,
  });

  const messages = useMemo(
    () =>
      allMessages.filter(
        (m) => m.pubkey === pubkey || m.tags.toString().includes(pubkey),
      ),
    [allMessages, pubkey],
  );

  const messagesLengthRef = useRef<number>(messages?.length || 0);

  useEffect(() => {
    navigation.setOptions({
      title: user?.name ? user.name : pubkey.slice(0, 8),
      headerRight: () => <HeaderRight user={user} />,
    });
  }, [navigation, user, pubkey]);

  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const replyMessageId = item.tags.find((tag) => tag[0] === 'e')?.[1];
      const replyMessage = messages.find((m) => m.id === replyMessageId);

      return (
        <ListItem
          message={item}
          otherPubkey={pubkey}
          otherPicture={user?.picture}
          userPubkey={userPubkey}
          nextMessage={messages?.[index - 1]}
          prevMessage={messages?.[index + 1]}
          replyMessage={replyMessage}
          onMenu={setMenuState}
          onReply={setReply}
          animate={index < messages?.length - messagesLengthRef.current}
        />
      );
    },
    [messages, userPubkey, pubkey, user?.picture],
  );

  return (
    <>
      <View style={styles.list}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          style={styles.scaleYInverted}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={15}
          keyExtractor={(message) => message.id}
          maxToRenderPerBatch={5}
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
      <MenuMessageBox
        {...menuState}
        onReply={setReply}
        onDismiss={() =>
          setMenuState((oldState) => ({ ...oldState, visible: false }))
        }
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
