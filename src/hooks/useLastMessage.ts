import { useMemo } from 'react';
import { useStores } from '../store';

const useLastMessage = (pubkey: string) => {
  const { messageStore } = useStores();
  const { messageList } = messageStore;

  return useMemo(
    () => messageList[pubkey]?.[messageList[pubkey]?.length - 1],
    [JSON.stringify(messageList[pubkey])],
  );
};

export default useLastMessage;
