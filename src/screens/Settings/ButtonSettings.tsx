import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

type ButtonSettingsProps = {
  title: string;
  icon: IconSource;
  onPress: () => void;
};

const ButtonSettings = ({ title, icon, onPress }: ButtonSettingsProps) => {
  const { colors } = useTheme();

  return (
    <>
      <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.root}>
          <Avatar.Icon
            icon={icon}
            style={styles.icon}
            size={40}
            color={colors.primary}
          />
          <View style={styles.title}>
            <Text>{title}</Text>
          </View>
          <Avatar.Icon
            icon="chevron-right"
            size={40}
            style={styles.icon}
            color={colors.primary}
          />
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    // backgroundColor: "blue",
  },
  title: { flex: 1 },
  icon: {
    margin: 10,
    backgroundColor: 'transparent',
  },
});

export default ButtonSettings;
