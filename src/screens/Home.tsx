import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Observer } from "mobx-react";
import { dateToUnix, useNostrEvents } from "nostr-react";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import Post from "../components/Post";
import { RootStackParamList } from "../navigation";
import { useStores } from "../store";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const { userStore } = useStores();
  const { events, unsubscribe } = useNostrEvents({
    filter: {
      kinds: [1],
      since: dateToUnix(new Date(Date.now() - 5 * 60000)),
    },
  });
  useEffect(() => {
    return () => {
      if (!!unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <Observer>
      {() => (
        <>
          <ScrollView>
            <Text>Home</Text>
            <Text>{userStore.key}</Text>
            {events.map((event) => (
              <Post key={event.id} event={event} />
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
