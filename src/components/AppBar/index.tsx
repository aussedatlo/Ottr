import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import * as React from "react";
import { Appbar as AppBarPaper } from "react-native-paper";

const AppBar = ({ navigation, back }: NativeStackHeaderProps) => (
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
  </AppBarPaper.Header>
);

export default AppBar;
