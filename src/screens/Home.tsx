import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Observer } from "mobx-react";
import { dateToUnix, useNostrEvents } from "nostr-react";
import { getEventHash, getPublicKey, signEvent } from "nostr-tools";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { RootStackParamList } from "..";
import Post from "../components/Post";
import { useStores } from "../store";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const { userStore } = useStores();

  const { events, isLoading } = useNostrEvents({
    filter: {
      kinds: [1],
      since: 0,
    },
  });

  const handlePost = () => {
    const event: any = {
      content: "message",
      kind: 1,
      tags: [],
      created_at: dateToUnix(),
      pubkey: getPublicKey(userStore.privKey),
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.privKey);

    publish(event);
  };

  console.log(events);

  return (
    <Observer>
      {() => (
        <View>
          <Text>Home</Text>
          <Text>{userStore.key}</Text>
          <Button onPress={handlePost}>Post</Button>
          {events.map((event) => (
            <Post key={event.id} content={event.content} />
          ))}
        </View>
      )}
    </Observer>
  );
};

export default HomeScreen;
function publish(event: any) {
  throw new Error("Function not implemented.");
}
