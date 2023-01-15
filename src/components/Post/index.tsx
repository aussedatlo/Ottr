import { useProfile } from "nostr-react";
import { Card, Text } from "react-native-paper";

type PostProps = {
  user: string;
  content: string;
};
const Post = ({ user, content }: PostProps) => {
  const { data: userData } = useProfile({
    pubkey: user,
  });
  const userProfile = userData && userData.name ? userData.name : user;

  return (
    <Card style={{ margin: 3, borderRadius: 0 }}>
      <Card.Title title={userProfile} />
      <Card.Content>
        <Text variant="bodyMedium">{content}</Text>
      </Card.Content>
    </Card>
  );
};

export default Post;
