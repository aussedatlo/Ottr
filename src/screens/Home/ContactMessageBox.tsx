import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import Avatar from "../../components/Avatar";
import useLastMessage from "../../hooks/useLastMessage";
import { RootStackParamList } from "../../navigation";
import { Contact } from "../../types/contact";

type ContactMessageBoxProps = {
  contact: Contact;
};
const ContactMessageBox = ({ contact }: ContactMessageBoxProps) => {
  const { pubkey, name } = contact;
  const { content } = useLastMessage(pubkey);

  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigate("Talk", { pubkey: pubkey })}
    >
      <View style={styles.root}>
        <Avatar pubkey={pubkey} size={50} />
        <View style={styles.container}>
          <Text>{name ? name : pubkey.slice(0, 8)}</Text>
          <Text
            variant="labelSmall"
            style={styles.secondary}
            numberOfLines={2}
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
    marginLeft: 15,
    justifyContent: "center",
  },
  secondary: {
    color: "grey",
  },
});

export default ContactMessageBox;
