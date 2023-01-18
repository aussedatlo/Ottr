import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as Updates from "expo-updates";
import { useNostr } from "nostr-react";
import { View } from "react-native";
import {
  Appbar as AppBarPaper,
  IconButton,
  useTheme,
} from "react-native-paper";
import { DEFAULT_RELAYS_URL } from "../../constant/relay";

const AppBar = ({ navigation, back, route }: NativeStackHeaderProps) => {
  const { connectedRelays } = useNostr();
  const theme = useTheme();

  return (
    <AppBarPaper.Header>
      {back ? <AppBarPaper.BackAction onPress={navigation.goBack} /> : null}
      <AppBarPaper.Content title={route.name} />
      {route.name === "Home" ? (
        <>
          <AppBarPaper.Action icon="magnify" onPress={() => {}} />
          <AppBarPaper.Action
            icon="account-circle-outline"
            onPress={() => navigation.navigate("Profile")}
          />
          <AppBarPaper.Action
            icon="cog"
            onPress={() => navigation.navigate("Settings")}
          />
        </>
      ) : (
        <></>
      )}

      <View>
        <IconButton
          onPress={() => Updates.reloadAsync()}
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

export default AppBar;
