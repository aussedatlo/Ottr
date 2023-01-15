import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Observer } from "mobx-react";
import { useNostr, useProfile } from "nostr-react";
import { getEventHash, getPublicKey, Kind, signEvent } from "nostr-tools";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { RootStackParamList } from "../navigation";
import { useStores } from "../store";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

type ProfileScreenState = {
  name: string | undefined;
  about: string | undefined;
  picture: string | undefined;
};

const ProfileScreen = ({ route, navigation }: ProfileScreenProps) => {
  const [state, setState] = useState<ProfileScreenState>({
    name: undefined,
    about: undefined,
    picture: undefined,
  });
  const { userStore } = useStores();
  const { publish } = useNostr();
  const { data: userData } = useProfile({
    pubkey: getPublicKey(userStore.key),
  });

  useEffect(() => {
    if (!state.name)
      setState((state) => ({
        name: userData.name,
        about: userData.about,
        picture: userData.picture,
      }));
  }, [userData]);

  const handleUpdate = () => {
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
    <Observer>
      {() => (
        <View>
          <TextInput
            value={userStore.key}
            onChange={(e) => userStore.setKey(e.nativeEvent.text)}
          />
          <TextInput
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.nativeEvent.text })}
          />
          <TextInput
            value={state.about}
            onChange={(e) => setState({ ...state, about: e.nativeEvent.text })}
          />
          <TextInput
            value={state.picture}
            onChange={(e) =>
              setState({ ...state, picture: e.nativeEvent.text })
            }
          />
          <Button onPress={handleUpdate}>Update</Button>
        </View>
      )}
    </Observer>
  );
};

export default ProfileScreen;
