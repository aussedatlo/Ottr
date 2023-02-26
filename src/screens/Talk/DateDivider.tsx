import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

type DateDividerProps = {
  createdAt: number;
  prevCreatedAt: number;
};

const DateDivider = ({ createdAt, prevCreatedAt }: DateDividerProps) => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const prevMessageDate = new Date(prevCreatedAt * 1000).toLocaleDateString();
  const currMessageDate = new Date(createdAt * 1000).toLocaleDateString();

  if (prevMessageDate === currMessageDate) return <></>;

  return (
    <View>
      <Divider style={styles.divider} />
      <Text variant="labelSmall" style={styles.date}>
        {currMessageDate}
      </Text>
    </View>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    divider: {
      marginLeft: 50,
      marginRight: 50,
      marginTop: 10,
    },
    date: {
      alignSelf: 'center',
      marginTop: 5,
      marginBottom: 20,
      color: colors.onSurfaceDisabled,
    },
  });
};

export default memo(DateDivider);
