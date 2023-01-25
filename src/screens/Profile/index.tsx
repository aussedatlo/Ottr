import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import { generatePrivateKey, getPublicKey } from "nostr-tools";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Input from "../../components/Input";
import { RootStackParamList } from "../../navigation";
import { useStores } from "../../store";
import ProfileSection from "./ProfileSection";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfileScreen = observer(({ route, navigation }: ProfileScreenProps) => {
  const [key, setKey] = useState<string>("");
  const { userStore, messageStore } = useStores();

  useEffect(() => {
    setKey(userStore.key);
  }, [userStore.key]);

  const handleUpdateKey = () => {
    try {
      getPublicKey(key);
      messageStore.reset();
      userStore.setKey(key);
      ToastAndroid.show("Key updated", ToastAndroid.SHORT);
    } catch (e) {
      ToastAndroid.show("Invalid key format", ToastAndroid.SHORT);
    }
  };

  const handleNewKey = () => {
    const newKey = generatePrivateKey();
    userStore.setKey(newKey);
  };

  return (
    <ScrollView style={styles.root}>
      <ProfileSection />

      <Text variant="labelLarge" style={styles.title}>
        Private Key:
      </Text>
      <Input
        value={key}
        placeholder="private key"
        onChange={(e) => setKey(e.nativeEvent.text)}
        multiline
      />

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleUpdateKey}
          style={styles.button}
          mode="contained"
          compact={false}
        >
          Update Private Key
        </Button>
        <Button
          onPress={handleNewKey}
          style={styles.button}
          mode="contained"
          compact={false}
        >
          New Private Key
        </Button>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  root: {
    padding: 15,
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
  },
  button: {
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 10,
    width: 200,
    alignSelf: "center",
  },
});

export default ProfileScreen;
