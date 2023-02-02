import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps, useTheme } from 'react-native-paper';
import { Theme } from '../../providers/ThemeProvider';

const Input = (
  props: Omit<
    TextInputProps,
    'underlineColor' | 'activeUnderlineColor' | 'style' | 'theme'
  >,
) => {
  const { colors } = useTheme<Theme>();
  return (
    <TextInput
      style={styles.input}
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      placeholderTextColor={colors.onSurfaceDisabled}
      selectionColor={colors.outlineVariant}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 0,
    border: 0,
    borderRadius: 5,
  },
});

export default Input;
