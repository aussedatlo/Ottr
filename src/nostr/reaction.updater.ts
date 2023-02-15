import { dateToUnix, useNostrEvents } from 'nostr-react';
import { Event, Kind } from 'nostr-tools';
import { useCallback } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useUserContext } from '../context/UserContext';
import { useMessages } from '../hooks/useMessages';
import { isReaction } from '../types/reaction';

const ReactionUpdater = (): null => {
  const { pubkey } = useUserContext();
  const { lastEvent } = useDatabaseContext();
  const since = lastEvent === 0 ? dateToUnix() : lastEvent;
  const { addReaction, addOtherReaction } = useMessages();

  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.Reaction],
      since: since,
      '#p': [pubkey],
    },
  });

  const onEventCallback = useCallback(
    async (event: Event) => {
      console.log(`event detected ${event.id}`);
      const messageId = event.tags.find((tag) => tag[0] === 'e')?.[1];
      const reaction = event.content;

      if (!isReaction(reaction) || !messageId) return;

      if (event.pubkey === pubkey) await addReaction(messageId, reaction);
      else await addOtherReaction(messageId, reaction);
    },
    [addReaction, pubkey],
  );

  onEvent(onEventCallback);
  return null;
};

export default ReactionUpdater;
