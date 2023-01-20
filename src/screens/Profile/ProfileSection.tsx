import { useNostr, useNostrEvents } from "nostr-react";
import { getEventHash, getPublicKey, Kind, signEvent } from "nostr-tools";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Input from "../../components/Input";
import { useStores } from "../../store";

type ProfileScreenState = {
  name: string | undefined;
  about: string | undefined;
  picture: string | undefined;
};

const ProfileSection = () => {
  const { userStore } = useStores();
  const { publish } = useNostr();
  const [state, setState] = useState<ProfileScreenState>({
    name: undefined,
    about: undefined,
    picture: undefined,
  });
  const date = useRef(Math.floor(Date.now() / 1000));

  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [0],
      since: 0,
      authors: [getPublicKey(userStore.key)],
    },
  });

  const onEventCallback = useCallback((event) => {
    if (!event.content || event.kind !== Kind.Metadata) return;
    const data = JSON.parse(event.content);

    setState((state) => ({ ...state, ...data }));

    if (event.created_at > date.current)
      ToastAndroid.showWithGravity(
        "Updated",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
  }, []);

  onEvent(onEventCallback);

  const onUpdateProfile = () => {
    let event: any = {
      kind: Kind.Metadata,
      created_at: Math.floor(Date.now() / 1000),
      content: JSON.stringify(state),
      pubkey: getPublicKey(userStore.key),
      tags: [],
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);
    publish(event);
  };

  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 15,
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
  },
  picture: {
    alignItems: "center",
    marginTop: 5,
  },
  button: {
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 10,
    width: 200,
    alignSelf: "center",
  },
  avatar: { overflow: "hidden", borderWidth: 2 },
});

export default ProfileSection;
