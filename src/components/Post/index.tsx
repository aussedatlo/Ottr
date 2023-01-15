import { Card, Text } from "react-native-paper";

type PostProps = {
  user: string;
  content: string;
};
const Post = ({ user, content }: PostProps) => {
  return (
    <Card style={{ margin: 3, borderRadius: 0 }}>
      <Card.Title title={user} />
      <Card.Content>
        <Text variant="bodyMedium">{content}</Text>
      </Card.Content>
    </Card>
  );
};

export default Post;
