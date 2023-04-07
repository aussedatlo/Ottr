import React, { useMemo } from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { Theme } from '../../providers/ThemeProvider';

type ButtonSettingsProps = {
  title: string;
  icon: IconSource;
  onPress: () => void;
};

const ButtonSettings = ({ title, icon, onPress }: ButtonSettingsProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;

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
            color={colors.onPrimaryContainer}
          />
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
    },
    title: { flex: 1 },
    icon: {
      margin: 5,
      backgroundColor: colors.transparent,
    },
  });
};

export default ButtonSettings;
