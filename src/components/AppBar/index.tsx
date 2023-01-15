import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useNostr } from "nostr-react";
import { View } from "react-native";
import { Appbar as AppBarPaper, Avatar, useTheme } from "react-native-paper";
import { DEFAULT_RELAYS_URL } from "../../constant/relay";

const AppBar = ({ navigation, back }: NativeStackHeaderProps) => {
  const { connectedRelays } = useNostr();
  const theme = useTheme();

  return (
    <AppBarPaper.Header>
      {back ? <AppBarPaper.BackAction onPress={navigation.goBack} /> : null}
      <AppBarPaper.Content title="Anostr" />
      <AppBarPaper.Action icon="magnify" onPress={() => {}} />
      <AppBarPaper.Action
        icon="account-circle-outline"
        onPress={() => navigation.navigate("Profile")}
      />
      <AppBarPaper.Action
        icon="cog"
        onPress={() => navigation.navigate("Settings")}
      />
      <View>
        <Avatar.Text
          size={24}
          label={connectedRelays.length.toString()}
          style={{
            backgroundColor:
              connectedRelays.length === 0
                ? theme.colors.error
                : connectedRelays.length === DEFAULT_RELAYS_URL.length
                ? theme.colors.secondary
                : theme.colors.error,
          }}
        />
      </View>
    </AppBarPaper.Header>
  );
};

export default AppBar;
