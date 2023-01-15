import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Observer } from "mobx-react";
import { useNostrEvents } from "nostr-react";
import { ScrollView, StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import Post from "../components/Post";
import { RootStackParamList } from "../navigation";
import { useStores } from "../store";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const { userStore } = useStores();
  const { events } = useNostrEvents({
    filter: {
      kinds: [1],
      since: 0,
    },
  });

  return (
    <Observer>
      {() => (
        <>
          <ScrollView>
            <Text>Home</Text>
            <Text>{userStore.key}</Text>
            {events.map((event) => (
              <Post
                key={event.id}
                content={event.content}
                user={event.pubkey}
              />
            ))}
          </ScrollView>
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => navigation.navigate("Post")}
          />
        </>
      )}
    </Observer>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
