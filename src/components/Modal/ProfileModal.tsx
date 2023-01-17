import { dateToUnix, useNostr, useNostrEvents } from "nostr-react";
import {
  Event,
  getEventHash,
  getPublicKey,
  Kind,
  signEvent,
} from "nostr-tools";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { DEFAULT_RELAYS_URL } from "../../constant/relay";
import { useStores } from "../../store";

const ProfileModal = ({ data, pub }: any) => {
  const { userStore } = useStores();
  const { publish } = useNostr();
  const { events, unsubscribe } = useNostrEvents({
    filter: {
      kinds: [Kind.Contacts],
      authors: [getPublicKey(userStore.key)],
      since: 0,
    },
  });
  const [tags, setTags] = useState([]);
  const isFollowed = useMemo(
    () =>
      tags.filter((tag) => tag[3] === (!!data && !!data.name ? data.name : pub))
        .length === 1,
    [tags]
  );

  useEffect(() => {
    if (!events || !events[0] || !events[0].tags) return;
    setTags(events[0].tags);
  }, [events]);

  useEffect(() => {
    return () => {
      if (!!unsubscribe) unsubscribe();
    };
  }, []);

  const handleFollow = () => {
    const event: Event = {
      kind: Kind.Contacts,
      tags: [
        ...tags,
        [
          "p",
          pub,
          DEFAULT_RELAYS_URL[0],
          !!data && !!data.name ? data.name : pub,
        ],
      ],
      content: "",
      pubkey: getPublicKey(userStore.key),
      created_at: dateToUnix(),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
  };

  const handleUnfollow = () => {
    const event: Event = {
      kind: Kind.Contacts,
      tags: tags.filter(
        (tag) => tag[3] !== (!!data && !!data.name ? data.name : pub)
      ),
      content: "",
      pubkey: getPublicKey(userStore.key),
      created_at: dateToUnix(),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
  };

  return (
    <View>
      <View style={styles.picture}>
        {!!data && !!data.picture ? (
          <Avatar.Image
            size={100}
            source={{ uri: data.picture }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Icon
            size={100}
            icon="account-question"
            style={styles.avatar}
          />
        )}

        <Text variant="titleLarge" style={styles.name}>
          {!!data && !!data.name ? data.name : pub}
        </Text>

        {!!data && !!data.nip05 ? (
          <Text style={styles.about}>{data.nip05}</Text>
        ) : (
          <></>
        )}

        {!!data && !!data.website ? (
          <Text style={styles.about}>{data.website}</Text>
        ) : (
          <></>
        )}

        <Text style={styles.about}>
          {!!data && !!data.about ? data.about : "no description available"}
        </Text>

        {isFollowed ? (
          <Button
            icon="account-multiple-minus-outline"
            style={styles.button}
            onPress={handleUnfollow}
          >
            Unfollow
          </Button>
        ) : (
          <Button
            icon="account-multiple-plus-outline"
            style={styles.button}
            onPress={handleFollow}
          >
            Follow
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  picture: {
    alignItems: "center",
    marginTop: -30,
    width: 300,
  },
  avatar: {
    overflow: "hidden",
    borderWidth: 2,
  },
  name: {
    alignSelf: "center",
    marginTop: 5,
  },
  about: {
    marginTop: 15,
  },
  button: { marginTop: 5 },
});

export default ProfileModal;
