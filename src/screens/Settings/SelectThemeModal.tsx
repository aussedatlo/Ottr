import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RadioButton, Text } from 'react-native-paper';
import { useUserContext } from '../../context/UserContext';

const SelectThemeModal = () => {
  const { themeMode, setThemeMode } = useUserContext();

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.text}>System default</Text>
        <RadioButton
          value="System"
          status={themeMode === 'system' ? 'checked' : 'unchecked'}
          onPress={() => setThemeMode('system')}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Light</Text>
        <RadioButton
          value="Light"
          status={themeMode === 'light' ? 'checked' : 'unchecked'}
          onPress={() => setThemeMode('light')}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Dark</Text>
        <RadioButton
          value="Dark"
          status={themeMode === 'dark' ? 'checked' : 'unchecked'}
          onPress={() => setThemeMode('dark')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: 150,
  },
});

export default SelectThemeModal;
