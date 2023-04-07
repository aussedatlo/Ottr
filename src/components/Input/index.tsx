import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

const Input = (
  props: Omit<
    TextInputProps,
    'underlineColor' | 'activeUnderlineColor' | 'theme'
  > & { roundness?: number },
) => {
  const theme = useTheme<Theme>();
  const { colors, roundness } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TextInput
      theme={{ roundness: props.roundness ? props.roundness : roundness }}
      style={styles.input}
      underlineColor={colors.transparent}
      activeUnderlineColor={colors.transparent}
      placeholderTextColor={colors.onSurfaceDisabled}
      selectionColor={colors.primaryContainer}
      dense
      {...props}
    />
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    input: {
      margin: 0,
      border: 0,
      backgroundColor: colors.tertiaryContainer,
    },
  });
};

export default Input;
