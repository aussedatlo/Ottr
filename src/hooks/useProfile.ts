import { useMemo } from 'react';
import { useStores } from '../store';

const useProfile = (pubkey: string) => {
  const { contactStore } = useStores();
  const { contactList } = contactStore;

  return useMemo(
    () => contactList.find((item) => item.pubkey === pubkey),
    [contactList, pubkey],
  );
};

export default useProfile;
