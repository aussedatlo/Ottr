import { useProfile } from "nostr-react";
import { Event, nip04 } from "nostr-tools";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Divider, IconButton, Text } from "react-native-paper";
import { useStores } from "../../store";
import ModalController from "../Modal/ModalController";
import ProfileModal from "../Modal/ProfileModal";
import TimeAgo from "./TimeAgo";

type PostProps = {
  event: Event;
};

const Post = ({ event }: PostProps) => {
  const { userStore } = useStores();
  const { data: userData } = useProfile({
    pubkey: event.pubkey,
  });
  const userProfile =
    userData && userData.name ? userData.name : event.pubkey.slice(0, 10);
  const [message, setMessage] = useState("");

  // const message =

  const initMessage = useCallback(async () => {
    try {
      console.log(event.content);
      console.log(event.pubkey);
      console.log(userStore.key);
      setMessage(
        await nip04.decrypt(userStore.key, event.pubkey, event.content)
      );
    } catch (e) {
      console.log(e);
    }
  }, [userStore.key, event]);

  useEffect(() => {
    initMessage();
  }, []);

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profile}
          onPress={() =>
            ModalController.showModal(
              "",
              <ProfileModal data={userData} pub={event.pubkey} />
            )
          }
        >
          {userData && userData.picture ? (
            <Avatar.Image
              size={48}
              source={{ uri: userData.picture }}
              style={styles.picture}
            />
          ) : (
            <Avatar.Icon
              size={48}
              icon="account-question"
              style={styles.picture}
            />
          )}
          <Text>{userProfile}</Text>
          <TimeAgo date={new Date(event.created_at * 1000)} />
        </TouchableOpacity>
        <IconButton icon="dots-vertical" onPress={() => {}} />
      </View>
      <Divider />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.content}>
          {message}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 3,
    padding: 5,
    borderRadius: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  picture: { overflow: "hidden", margin: 5, marginRight: 10 },
  content: { marginTop: 10 },
  profile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Post;
