import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { memo } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "react-native-paper";
import Avatar from "../../components/Avatar";
import useProfile from "../../hooks/useProfile";
import { RootStackParamList } from "../../navigation";

type ContactBoxProps = {
  pubkey: string;
};

const ContactBox = ({ pubkey }: ContactBoxProps) => {
  const { name, picture } = useProfile(pubkey) || { name: "", picture: "" };
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
          <Text variant="labelSmall" style={styles.secondary}>
            {pubkey.slice(0, 30)}...
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
    marginLeft: 10,
    justifyContent: "center",
  },
  secondary: {
    color: "grey",
  },
});

export default memo(ContactBox);
