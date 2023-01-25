import { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-paper";
import { Message } from "../../store/user.store";

type MessageProps = Message;

const MessageBox = ({
  content,
  created_at,
  isSend,
  isSender,
  pubkey,
}: MessageProps) => {
  const time = new Date(created_at * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => console.log("updated"));

  return (
    <View style={[styles.root, isSender ? styles.send : styles.receive]}>
      <Text>{content}</Text>
      <View style={styles.bottom}>
        <Text style={styles.time}>{time}</Text>
        <Avatar.Icon
          style={{ backgroundColor: "white" }}
          size={12}
          icon={isSend ? "check-all" : "check"}
          color="#01F0FF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 15,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
  },
  send: {
    backgroundColor: "#01F0FF",
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  receive: {
    backgroundColor: "#1EF09C",
    alignSelf: "flex-start",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: { fontSize: 10, marginRight: 5 },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
});

export default memo(MessageBox);
