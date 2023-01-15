import ReactTimeAgo from "react-time-ago";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";

const Time = ({ children }) => {
  const { colors } = useTheme();
  return <Text style={styles(colors).timeAgo}>{children}</Text>;
};

type TimeAgoProps = {
  date: Date;
};

const TimeAgo = ({ date }: TimeAgoProps) => (
  <ReactTimeAgo
    component={Time}
    date={date}
    timeStyle="twitter"
    locale="en-US"
  />
);

const styles = (props) => {
  return StyleSheet.create({
    timeAgo: {
      marginLeft: 10,
      color: props.tertiary,
    },
  });
};

export default TimeAgo;
