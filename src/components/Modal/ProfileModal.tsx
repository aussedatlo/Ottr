import { observer } from "mobx-react";
import { dateToUnix, useNostr } from "nostr-react";
import {
  Event,
  getEventHash,
  getPublicKey,
  Kind,
  signEvent,
} from "nostr-tools";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { DEFAULT_RELAYS_URL } from "../../constant/relay";
import { useStores } from "../../store";

const ProfileModal = observer(({ data, pub }: any) => {
  const { userStore } = useStores();
  const { publish } = useNostr();

  const isInContactList = !!userStore.contactList.filter((f) => f.pub === pub)
    .length;

  useEffect(() => {
    // update contacts on relay
    const event: Event = {
      kind: Kind.Contacts,
      tags: userStore.contactList.reduce(
        (a, i) => [...a, ["p", i.pub, i.relay, ""]],
        []
      ),
      content: "",
      pubkey: getPublicKey(userStore.key),
      created_at: dateToUnix(),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);

    publish(event);
  }, [userStore.contactList.length]);

  const handleFollow = () => {
    userStore.follow({ pub: pub, relay: DEFAULT_RELAYS_URL[0] });
  };

  const handleUnfollow = () => {
    userStore.unfollow({ pub: pub, relay: DEFAULT_RELAYS_URL[0] });
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

        {isInContactList ? (
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
});

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
