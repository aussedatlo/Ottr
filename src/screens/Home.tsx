import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { dateToUnix, useNostrEvents } from "nostr-react";
import { Event } from "nostr-tools";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { FAB, Text } from "react-native-paper";
import Post from "../components/Post";
import { RootStackParamList } from "../navigation";

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

const HomeScreen = ({ route, navigation }: HomeScreenProps) => {
  const { events, unsubscribe } = useNostrEvents({
    filter: {
      kinds: [1],
      since: dateToUnix(new Date(Date.now() - 1 * 60000)),
    },
  });
  const [eventsList, setEventsList] = useState<Array<Event>>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    if (events.length === eventsList.length) return;
    setRefreshing(true);
    setEventsList(events);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [events]);

  useEffect(() => {
    return () => {
      if (!!unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <>
      <SafeAreaView>
        <View
          style={{
            position: "absolute",
            top: 5,
            left: Dimensions.get("window").width / 2 - 50,
            zIndex: 9,
            backgroundColor: "#eee",
            borderRadius: 5,
            width: 100,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
            display: events.length - eventsList.length ? "flex" : "none",
          }}
        >
          <Text>{events.length - eventsList.length} news</Text>
        </View>
        <FlatList
          data={eventsList}
          renderItem={({ item }) => <Post event={item} />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          style={{ height: " 100%" }}
        />
      </SafeAreaView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate("Post")}
      />
    </>
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
