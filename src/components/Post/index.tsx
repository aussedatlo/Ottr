import { View } from "react-native";
import { Text } from "react-native-paper";

type PostProps = {
  content: string;
};
const Post = ({ content }: PostProps) => {
  return (
    <View>
      <Text>{content}</Text>
    </View>
  );
};

export default Post;
