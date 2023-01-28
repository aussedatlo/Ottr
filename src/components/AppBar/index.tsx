import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useNostr } from "nostr-react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Appbar as AppBarPaper, IconButton, Text } from "react-native-paper";
import { DEFAULT_RELAYS_URL } from "../../constant/relay";
import useProfile from "../../hooks/useProfile";
import { useStores } from "../../store";
import Avatar from "../Avatar";
import ModalController from "../Modal/ModalController";
import ShareKeyModal from "../Modal/ShareKeyModal";

const AppBar = ({ navigation, back, route }: NativeStackHeaderProps) => {
  const { connectedRelays } = useNostr();
  const { name } = useProfile(route.params?.pubkey) || { name: "" };
  const { userStore } = useStores();

  const getTitle = () => {
    switch (route.name) {
      case "Home":
        return <Text>Ottr</Text>;
      case "Talk":
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar pubkey={route.params?.pubkey} />
            <Text variant="titleLarge" style={{ marginLeft: 10 }}>
              {name}
            </Text>
          </View>
        );
      case "SelectContact":
        return <Text>Select contact</Text>;
      default:
        return <Text>{route.name}</Text>;
    }
  };

  return (
    <AppBarPaper.Header>
      {back ? (
        <AppBarPaper.BackAction onPress={navigation.goBack} />
      ) : (
        <TouchableWithoutFeedback
          onPress={() =>
            ModalController.showModal("Public Key", <ShareKeyModal />)
          }
        >
          <View style={styles.avatar}>
            <Avatar pubkey={userStore.pubkey} />
          </View>
        </TouchableWithoutFeedback>
      )}

      <AppBarPaper.Content title={getTitle()} />
      {route.name === "Home" ? (
        <>
          <AppBarPaper.Action
            icon="cog"
            onPress={() => navigation.navigate("SettingsNav")}
          />
        </>
      ) : (
        <></>
      )}

      <View>
        <IconButton
          icon="checkbox-multiple-marked-circle"
          iconColor={
            connectedRelays.length === DEFAULT_RELAYS_URL.length
              ? "#26A65B"
              : "red"
          }
        />
      </View>
    </AppBarPaper.Header>
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginRight: 10,
    marginLeft: 10,
  },
});

export default AppBar;
