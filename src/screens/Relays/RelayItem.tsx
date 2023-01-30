import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";

type RelayItemProps = {
  relay: string;
  onClose: (relay: string) => void;
};

const RelayItem = ({ relay, onClose }: RelayItemProps) => {
  return (
    <View style={styles.root}>
      <Chip icon="lan" closeIcon="close" onClose={() => onClose(relay)}>
        {relay}
      </Chip>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    marginTop: 5,
  },
});

export default RelayItem;
