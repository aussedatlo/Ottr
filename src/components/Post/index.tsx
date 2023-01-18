import { useProfile } from "nostr-react";
import { Event } from "nostr-tools";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Divider, IconButton, Text } from "react-native-paper";
import ModalController from "../Modal/ModalController";
import ProfileModal from "../Modal/ProfileModal";
import TimeAgo from "./TimeAgo";

type PostProps = {
  event: Event;
};

const Post = ({ event }: PostProps) => {
  const { data: userData } = useProfile({
    pubkey: event.pubkey,
  });
  const userProfile =
    userData && userData.name ? userData.name : event.pubkey.slice(0, 10);

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
          {event.content}
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
