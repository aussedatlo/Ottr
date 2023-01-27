import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import useLastMessage from "../../hooks/useLastMessage";
import { RootStackParamList } from "../../navigation";
import { Contact } from "../../types/contact";

type ContactMessageBoxProps = {
  contact: Contact;
};
const ContactMessageBox = ({ contact }: ContactMessageBoxProps) => {
  const { pubkey, name, picture } = contact;
  const { content } = useLastMessage(pubkey);

  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigate("Talk", { pubkey: pubkey })}
    >
      <View style={styles.root}>
        <Avatar.Image source={{ uri: picture }} size={50} />
        <View style={styles.container}>
          <Text>{name ? name : pubkey.slice(0, 8)}</Text>
          <Text
            variant="labelSmall"
            style={styles.secondary}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {content}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  secondary: {
    color: "grey",
  },
});

export default ContactMessageBox;
