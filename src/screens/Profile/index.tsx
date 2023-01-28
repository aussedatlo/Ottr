import { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Avatar from "../../components/Avatar";
import Input from "../../components/Input";
import { useStores } from "../../store";
import { Contact } from "../../types/contact";

const ProfileSection = () => {
  const { userStore } = useStores();
  const { profile } = userStore;
  const [state, setState] = useState<Contact>({
    pubkey: userStore.pubkey,
    name: "",
    about: "",
    picture: "",
  });

  useEffect(() => {
    setState((state) => ({ ...state, ...profile }));
  }, [profile]);

  const onUpdateProfile = () => {
    ToastAndroid.show("updated", ToastAndroid.SHORT);
    userStore.setProfile(state);
  };

  return (
    <View style={styles.root}>
      <View style={styles.picture}>
        <Avatar pubkey={userStore.pubkey} picture={state.picture} size={60} />
      </View>
      <Text variant="labelLarge" style={styles.title}>
        Display name:
      </Text>
      <Input
        value={state.name}
        placeholder="name to display"
        onChange={(e) => setState({ ...state, name: e.nativeEvent.text })}
      />
      <Text variant="labelLarge" style={styles.title}>
        About you:
      </Text>
      <Input
        value={state.about}
        placeholder="A little description of yourself"
        onChange={(e) => setState({ ...state, about: e.nativeEvent.text })}
        numberOfLines={3}
        multiline
      />
      <Text variant="labelLarge" style={styles.title}>
        Picture url:
      </Text>
      <Input
        value={state.picture}
        placeholder="https://"
        onChange={(e) => setState({ ...state, picture: e.nativeEvent.text })}
      />

      <View style={styles.buttonContainer}>
        <Button
          onPress={onUpdateProfile}
          style={styles.button}
          mode="contained"
          compact={false}
        >
          Update Profile
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 15,
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
  },
  picture: {
    width: 60,
    alignSelf: "center",
    overflow: "hidden",
    borderRadius: 100,
  },
  button: {
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 30,
    width: 200,
    alignSelf: "center",
  },
  avatar: { overflow: "hidden", borderWidth: 2 },
});

export default ProfileSection;
