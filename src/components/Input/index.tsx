import { StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';

const Input = (
  props: Omit<
    TextInputProps,
    'underlineColor' | 'activeUnderlineColor' | 'style' | 'theme'
  >,
) => (
  <TextInput
    style={styles.input}
    underlineColor="transparent"
    activeUnderlineColor="transparent"
    placeholderTextColor="#9B979C"
    selectionColor="#CFBCFF"
    {...props}
  />
);

const styles = StyleSheet.create({
  input: {
    margin: 0,
    border: 0,
    borderRadius: 5,
  },
  title: {
    fontSize: 15,
  },
});

export default Input;
